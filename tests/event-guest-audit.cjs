const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')
function load(file, mocks = {}) {
  const exports = {}
  const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  vm.runInNewContext(code, { exports, console, Date, URL, require(id) {
    if (id in mocks) return mocks[id]
    if (id === 'zod') return require(id)
    throw new Error(`Unmocked dependency: ${id}`)
  } })
  return exports
}
const schema = load('src/lib/event-schema.ts', {
  './gallery-customization': { defaultCustomization: { groom: '', bride: '', monogram: '', hashtag: '', welcomeMessage: '', guestLanguage: 'ms', guestLayout: 'polaroid-wall', themeColourId: 'blush', guestFontId: 'dancing-script', keepsakeBackground: '', storyTemplateIds: [], backgroundMusic: '', videoCover: '', wishlist: [], itinerary: [], chatAiEnabled: false, pdfEnabled: false } },
})
const valid = { title: 'Majlis Ujian', slug: 'majlis-ujian', eventType: 'wedding', eventDate: '2027-01-01T10:00:00Z' }
test('event schema rejects reserved slug, invalid dates and unsafe links', () => {
  for (const extra of [{ slug: 'admin' }, { eventDate: 'bad' }, { mapsLink: 'javascript:alert(1)' }, { rsvpDeadline: '2028-01-01' }]) {
    assert.equal(schema.eventSchema.safeParse({ ...valid, ...extra }).success, false)
  }
})
test('theme stored in schema-supported theme_config and free defaults consistent', () => {
  const data = schema.eventSchema.parse(valid)
  const row = schema.eventRow(data)
  assert.equal(row.theme, undefined)
  assert.equal(row.theme_config.theme, 'glass')
  assert.equal(schema.defaultEventModules(data).find(module => module.module_type === 'rsvp').is_enabled, true)
})
test('public model maps location and safely defaults missing modules', () => {
  const { toEventView } = load('src/lib/event-view.ts', {
    './gallery-customization': { defaultCustomization: { groom: '', bride: '', monogram: '', hashtag: '', welcomeMessage: '', guestLanguage: 'ms', guestLayout: 'polaroid-wall', themeColourId: 'blush', guestFontId: 'dancing-script', keepsakeBackground: '', storyTemplateIds: [], backgroundMusic: '', videoCover: '', wishlist: [], itinerary: [], chatAiEnabled: false, pdfEnabled: false } },
  })
  const model = toEventView({ id: 'id', title: 'Event', event_date: valid.eventDate, venue_name: 'Dewan', venue_address: 'KL' })
  assert.equal(model.venueName, 'Dewan')
  assert.equal(model.venueAddress, 'KL')
  assert.equal(model.modules.seating, false)
  assert.equal(model.modules.rsvp, false)
  assert.equal(model.angpao.accountNumber, '')
})
const next = { NextResponse: { json: (body, init = {}) => ({ body, status: init.status || 200 }) } }
const guest = load('src/lib/guest-api.ts', {
  'next/server': next,
  '@/lib/supabase': {},
  '@/lib/premium': { isPremiumModule: () => false, isPremiumHost: async () => true },
})
test('guest RSVP requires explicit consent and UUID; rejects fractional pax', () => {
  const input = { eventId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', guestName: 'Tetamu', phoneNumber: '0123456789', pax: 1, privacyConsent: true }
  assert.equal(guest.rsvpSchema.safeParse(input).success, true)
  for (const extra of [{ privacyConsent: undefined }, { privacyConsent: false }, { eventId: 'event-slug' }, { pax: 1.5 }]) {
    assert.equal(guest.rsvpSchema.safeParse({ ...input, ...extra }).success, false)
  }
})
test('checkin uses compare-and-set and export status requires ownership', () => {
  const checkin = fs.readFileSync(path.join(__dirname, '../src/app/api/rsvps/checkin/route.ts'), 'utf8')
  assert.match(checkin, /checked_in\.eq\.false,checked_in\.is\.null/)
  assert.match(checkin, /alreadyCheckedIn: !updated/)
  const exporter = fs.readFileSync(path.join(__dirname, '../src/app/api/rsvps/export/route.ts'), 'utf8')
  assert.match(exporter.slice(exporter.indexOf('export async function GET')), /requireEventOwner/)
})
test('email-only confirmation endpoint disabled without DB dependencies', async () => {
  const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, '../src/app/api/auth/confirm-email/route.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
  const exports = {}
  vm.runInNewContext(code, { exports, Response })
  assert.equal((await exports.POST()).status, 410)
})