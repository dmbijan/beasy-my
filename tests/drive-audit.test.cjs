const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')

// Only explicitly allowed mocks/builtins may load: no network or real DB clients.
function load(file, mocks) {
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8')
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  const exports = {}
  vm.runInNewContext(code, {
    exports, Buffer, File, console,
    process: { env: { GOOGLE_TOKENS_ENCRYPTION_KEY: 'isolated-test-key' } },
    require(id) {
      if (Object.hasOwn(mocks, id)) return mocks[id]
      if (['crypto', 'node:stream', 'zod'].includes(id)) return require(id)
      throw new Error(`Unexpected dependency: ${id}`)
    },
  }, { filename: file })
  return exports
}

function database(resolve) {
  return { from(table) {
    const filters = {}
    const query = {
      select() { return query }, order() { return query }, limit() { return query },
      eq(key, value) { filters[key] = value; return query },
      single() { return Promise.resolve(resolve(table, filters)) },
      maybeSingle() { return query.single() },
      then(ok, fail) { return query.single().then(ok, fail) },
      upsert(value) { return Promise.resolve(resolve(table, filters, value)) },
      insert(value) { return Promise.resolve(resolve(table, filters, value)) },
    }
    return query
  } }
}

function library() {
  const writes = [], permissions = [], uploads = []
  class OAuth2 {
    setCredentials(value) { this.credentials = value }
    async refreshAccessToken() { return { credentials: { access_token: 'new-access', expiry_date: Date.now() + 3600000 } } }
  }
  const google = {
    auth: { OAuth2 },
    drive: ({ auth }) => ({ auth, files: { async create(params) {
      uploads.push(params)
      return { data: { id: 'file', webViewLink: 'link' } }
    } }, permissions: { async create(params) { permissions.push(params) } } }),
    sheets: ({ auth }) => ({ spreadsheets: {
      async create() { return { data: { spreadsheetId: 'sheet' } } },
      values: Object.fromEntries(['append', 'update'].map(method => [method, async params => {
        writes.push({ auth, ...params }); return { data: {} }
      }])),
    } }),
  }
  const db = database((table, filters) => ({ data: {
    access_token: `access-${filters.host_id}`, refresh_token: `refresh-${filters.host_id}`,
    token_expiry: new Date(Date.now() + 3600000).toISOString(),
  }, error: null }))
  return { api: load('src/lib/google-drive.ts', { googleapis: { google }, './supabase': { supabaseAdmin: db } }), writes, permissions, uploads }
}

test('concurrent hosts never share Drive or Sheets OAuth credentials', async () => {
  const { api, writes } = library()
  const [a, b] = await Promise.all([api.getGoogleDriveClient('a'), api.getGoogleDriveClient('b')])
  assert.notEqual(a.auth, b.auth)
  assert.equal(a.auth.credentials.access_token, 'access-a')
  await Promise.all(['a', 'b'].map(host => api.appendToGoogleSheet(host, host, 'RSVP!A:H', [['=1+1']])))
  for (const write of writes) {
    assert.equal(write.auth.credentials.access_token, `access-${write.spreadsheetId}`)
    assert.equal(write.valueInputOption, 'RAW')
  }
})

test('upload uses readable bytes and valid Drive fields', async () => {
  const { api, uploads } = library()
  await api.uploadFileToDrive('a', 'folder', { name: 'audio.webm', mimeType: 'audio/webm', buffer: Buffer.from('bytes') }, false)
  const chunks = []
  for await (const chunk of uploads[0].media.body) chunks.push(chunk)
  assert.equal(Buffer.concat(chunks).toString(), 'bytes')
  assert.equal(uploads[0].fields, 'id, webViewLink, webContentLink')
})

test('RSVP sheets stay private, preserve literal input and fit seven summary rows', async () => {
  const { api, writes, permissions } = library()
  await api.createRSVPSpreadsheet('a', 'Event')
  await api.exportRSVPsToGoogleSheet('b', 'event', 'Event', [{ guest_name: '=IMPORTXML("url")', phone_number: '+601234', pax: 2, attendance_status: 'pending', checked_in: false, created_at: '2026-01-01' }])
  assert.equal(permissions.length, 0)
  assert.ok(writes.every(write => write.valueInputOption === 'RAW'))
  const summary = writes.find(write => write.range.startsWith('Summary!'))
  assert.equal(summary.range, 'Summary!A1:B7')
  assert.equal(summary.requestBody.values.length, 7)
  assert.equal(writes.find(write => write.range.startsWith("'RSVP Data'!A2")).requestBody.values[0][1], '=IMPORTXML("url")')
})

test('premium expiration rejects expired, invalid and nonpremium profiles', () => {
  const { api } = library()
  for (const profile of [null, { is_premium: false }, { is_premium: true, premium_expires_at: 'invalid' }, { is_premium: true, premium_expires_at: '2000-01-01' }]) assert.equal(api.hasActiveDrivePremium(profile), false)
  assert.equal(api.hasActiveDrivePremium({ is_premium: true, premium_expires_at: null }), true)
  assert.equal(api.hasActiveDrivePremium({ is_premium: true, premium_expires_at: '2999-01-01' }), true)
})

const next = { NextResponse: { json: (body, init = {}) => ({ body, status: init.status || 200 }) } }
test('legacy callback returns 410 without loading DB or Google dependencies', async () => {
  const route = load('src/app/api/auth/google/callback/route.ts', { 'next/server': next })
  const result = await route.GET(new Request('http://localhost/?code=evil&hostId=victim'))
  assert.equal(result.status, 410)
  assert.match(result.body.error, /NextAuth/)
})

test('upload gates active event, host, module and premium before calling Drive; accepts WebM', async () => {
  const { api } = library()
  for (const scenario of ['inactive', 'no-host', 'disabled', 'expired', 'valid']) {
    let uploaded = 0
    const db = database(table => ({ error: null, data: table === 'events'
      ? { id: 'event', host_id: scenario === 'no-host' ? null : 'host', is_active: scenario !== 'inactive', drive_folder_id: 'folder' }
      : table === 'event_modules' ? { is_enabled: scenario !== 'disabled' }
      : table === 'profiles' ? { is_premium: true, premium_expires_at: scenario === 'expired' ? '2000-01-01' : null } : {} }))
    const route = load('src/app/api/drive/upload/route.ts', {
      'next/server': next, '@/lib/supabase': { supabaseAdmin: db },
      '@/lib/google-drive': { hasActiveDrivePremium: api.hasActiveDrivePremium, async uploadFileToDrive(host, folder, file) {
        uploaded++; assert.equal(host, 'host'); assert.equal(file.mimeType, 'audio/webm'); return { fileId: 'file' }
      } },
    })
    const form = new FormData()
    form.set('eventSlug', 'event'); form.set('file', new File(['audio'], 'audio.webm', { type: 'audio/webm;codecs=opus' }))
    const result = await route.POST({ formData: async () => form })
    assert.equal(result.status, scenario === 'valid' ? 200 : 403, scenario)
    assert.equal(uploaded, scenario === 'valid' ? 1 : 0, scenario)
  }
})

test('existing Drive folder cannot bypass ownership or premium expiry', async () => {
  const { api } = library()
  for (const scenario of ['unauthenticated', 'other-host', 'inactive', 'expired', 'valid']) {
    const db = database(table => ({ error: null, data: table === 'events'
      ? { host_id: scenario === 'other-host' ? 'other' : 'host', is_active: scenario !== 'inactive', drive_folder_id: 'existing-folder' }
      : table === 'profiles' ? { is_premium: true, premium_expires_at: scenario === 'expired' ? '2000-01-01' : null }
      : [{ host_id: 'host' }] }))
    const route = load('src/app/api/drive/check-access/route.ts', {
      'next/server': next, '@/lib/supabase': { supabaseAdmin: db },
      '@/lib/auth': { auth: async () => scenario === 'unauthenticated' ? null : { user: { id: 'host' } } },
      '@/lib/google-drive': { hasActiveDrivePremium: api.hasActiveDrivePremium },
    })
    const result = await route.POST({ json: async () => ({ eventId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa' }) })
    if (scenario === 'unauthenticated') assert.equal(result.status, 401)
    else if (['other-host', 'inactive'].includes(scenario)) assert.equal(result.status, 403)
    else {
      assert.equal(result.status, 200)
      assert.equal(result.body.hasDrive, scenario === 'valid')
      assert.equal(result.body.isPremium, scenario === 'valid')
      assert.equal(result.body.requiresPayment, scenario !== 'valid')
    }
  }
})

test('invalid upload payloads are rejected before any database or Drive access', async () => {
  const route = load('src/app/api/drive/upload/route.ts', {
    'next/server': next, '@/lib/supabase': { supabaseAdmin: { from() { assert.fail('Unexpected database access') } } },
    '@/lib/google-drive': { uploadFileToDrive() { assert.fail('Unexpected Drive access') } },
  })
  for (const file of ['not-a-file', new File([], 'empty.png', { type: 'image/png' }), new File(['html'], 'page.html', { type: 'text/html' })]) {
    const form = new FormData()
    form.set('eventSlug', 'event'); form.set('file', file)
    assert.equal((await route.POST({ formData: async () => form })).status, 400)
  }
  assert.equal((await route.POST({ formData: async () => { throw new Error('Malformed multipart') } })).status, 400)
})

test('encrypted token storage preserves the signature and propagates persistence errors', async () => {
  let stored
  const db = database((table, filters, value) => { stored = value; return { error: null } })
  const api = load('src/lib/google-drive.ts', { googleapis: { google: {} }, './supabase': { supabaseAdmin: db } })
  assert.equal(api.storeTokensEncrypted.length, 4)
  await api.storeTokensEncrypted('host', 'access', 'refresh', new Date('2099-01-01'))
  assert.equal(stored.host_id, 'host')
  assert.match(stored.access_token, /^[a-f0-9]{24}:[a-f0-9]{32}:[a-f0-9]+$/)
  assert.notEqual(stored.refresh_token, 'refresh')
  const failing = load('src/lib/google-drive.ts', { googleapis: { google: {} }, './supabase': { supabaseAdmin: database(() => ({ error: { message: 'offline' } })) } })
  await assert.rejects(failing.storeTokensEncrypted('host', 'access', 'refresh', new Date()), /Failed to store Google tokens/)
})