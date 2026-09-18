const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const ts = require('typescript')
const vm = require('node:vm')
const path = require('node:path')

function load(file, mocks = {}, fetchMock = () => { throw Error('Network forbidden') }) {
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8')
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  const exports = {}
  vm.runInNewContext(code, { exports, require: id => { if (!(id in mocks)) throw Error(`Unmocked ${id}`); return mocks[id] },
    process: { env: { TOYYIBPAY_SECRET_KEY: 'mock', TOYYIBPAY_CATEGORY_CODE: 'mock' } },
    URL, URLSearchParams, AbortSignal, fetch: fetchMock, console })
  return exports
}
const gateway = load('src/lib/toyyibpay.ts')
test('decimal amounts are exact and reject malformed values', () => {
  for (const value of [159, '159', '159.00']) assert.equal(gateway.myrToSen(value), 15900)
  for (const value of ['', null, '159.001', '-159', '1e2', NaN]) assert.equal(gateway.myrToSen(value), null)
})
test('normalize bill array/object and derive trusted URL', () => {
  assert.equal(gateway.normalizeBillResult([{ BillCode: 'abc', BillURL: 'https://evil.test' }]).billUrl, 'https://dev.toyyibpay.com/abc')
  assert.equal(gateway.normalizeBillResult({ bill_code: 'abc' }).billCode, 'abc')
  assert.throws(() => gateway.normalizeBillResult([]))
  assert.throws(() => gateway.normalizeBillResult({ BillCode: '../evil' }))
})
const paid = { billpaymentStatus: '1', billpaymentAmount: '159.00', billpaymentInvoiceNo: 'receipt' }
test('successful attempt wins regardless of order', () => {
  for (const rows of [[{ status: '3' }, paid], [paid, { status: '2' }]]) {
    assert.equal(gateway.normalizeTransactions(rows, 'abc', 15900).status, 'paid')
  }
})
test('wrong amount, wrong bill, missing trusted ID never settle', () => {
  for (const amount of ['1.59', '15900', '160', null]) assert.throws(() => gateway.normalizeTransactions([{ ...paid, billpaymentAmount: amount }], 'abc', 15900))
  assert.throws(() => gateway.normalizeTransactions([{ ...paid, billpaymentInvoiceNo: '' }], 'abc', 15900))
  assert.equal(gateway.normalizeTransactions([{ ...paid, billcode: 'other' }], 'abc', 15900).status, 'unknown')
  assert.throws(() => gateway.normalizeTransactions({ error: 'bad' }, 'abc', 15900))
})
test('mock create uses sen, form body and order reference', async () => {
  const api = load('src/lib/toyyibpay.ts', {}, async (url, options) => {
    assert.match(url, /createBill$/)
    assert.equal(options.body.get('billAmount'), '15900')
    assert.equal(options.body.get('billExternalReferenceNo'), 'order')
    return { ok: true, json: async () => [{ BillCode: 'abc' }] }
  })
  await api.createToyyibPayBill({ amount: 159, description: 'test', name: 'Buyer', email: 'buyer@example.test', orderId: 'order', callbackUrl: 'https://example.test/callback', returnUrl: 'https://example.test/return' })
})
function service(order, verified, rpcResult = { data: 'paid' }) {
  let calls = 0
  const updates = []
  const query = { select() { return this }, eq(...args) { updates.push(args); return this },
    maybeSingle: async () => ({ data: order }), update(value) { updates.push(value); return this } }
  const api = load('src/lib/payment-service.ts', {
    '@/lib/auth': { auth: async () => null },
    '@/lib/supabase': { supabaseAdmin: { from: () => query, rpc: async () => rpcResult } },
    '@/lib/toyyibpay': { ...gateway, getBillStatus: async () => { calls++; return verified } },
  })
  return { api, updates, calls: () => calls }
}
const order = { id: 'order', host_id: 'owner', currency: 'MYR', amount: 159, status: 'pending' }
test('unknown orders do not query gateway', async () => {
  const s = service(null)
  await assert.rejects(s.api.verifyAndSettle('abc'))
  assert.equal(s.calls(), 0)
})
test('paid records are monotonic and missing migration fails closed', async () => {
  const s = service({ ...order, status: 'paid' })
  assert.equal(await s.api.verifyAndSettle('abc'), 'paid')
  assert.equal(s.calls(), 0)
  await assert.rejects(service(order, { status: 'paid', paymentId: 'receipt' }, { error: 'missing RPC' }).api.verifyAndSettle('abc'))
})
test('failed update is conditional and never overwrites buyer identity', async () => {
  const s = service(order, { status: 'failed' })
  await s.api.verifyAndSettle('abc')
  assert.ok(s.updates.some(value => Array.isArray(value) && value[0] === 'status' && value[1] === 'pending'))
  assert.ok(!JSON.stringify(s.updates).includes('user_email'))
})
test('both cron methods reject absent secret including Bearer undefined', async () => {
  const cron = load('src/app/api/cron/reconcile-payments/route.ts', {
    'next/server': { NextResponse: { json: (body, options) => ({ body, ...options }) } },
    '@/lib/supabase': { supabaseAdmin: { from() { throw Error('DB forbidden') } } },
    '@/lib/payment-service': {},
  })
  for (const method of ['GET', 'POST']) assert.equal((await cron[method]({ headers: new Headers({ authorization: 'Bearer undefined' }) })).status, 401)
})

test('create never exposes URL when durable insert or bill linkage fails', async () => {
  for (const failure of ['readiness', 'insert', 'link', null]) {
    const events = []
    let operation = ''
    const query = {
      insert(value) { events.push('insert'); operation = 'insert'; assert.equal(value.host_id, 'owner'); assert.equal(value.amount, 159); return this },
      update() { events.push('link'); operation = 'link'; return this },
      select() { return this }, eq() { return this }, is() { return this },
      single: async () => operation === failure ? { error: 'mock failure' } : { data: { id: 'order' } },
    }
    class PaymentError extends Error { constructor(message, status = 503) { super(message); this.status = status } }
    // Test loader environment deliberately contains no production credentials.
    const source = fs.readFileSync(path.join(__dirname, '../src/app/api/payment/create/route.ts'), 'utf8')
    const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
    const exports = {}
    const mocks = {
      'next/server': { NextResponse: { json: (body, options) => ({ body, status: options?.status || 200 }) } },
      '@/lib/toyyibpay': { PREMIUM_PRICE: 159, createToyyibPayBill: async () => { events.push('gateway'); return { billCode: 'abc', billUrl: 'https://dev.toyyibpay.com/abc' } } },
      '@/lib/supabase': { supabaseAdmin: { from: () => query, rpc: async () => ({ data: failure !== 'readiness' }) } },
      '@/lib/payment-service': { PaymentError, paymentOwner: async () => ({ id: 'owner', email: 'owner@example.test' }) },
    }
    vm.runInNewContext(code, { exports, require: id => mocks[id], process: { env: { NEXT_PUBLIC_URL: 'https://example.test' } }, URL, console: { error() {} } })
    const result = await exports.POST({})
    if (failure) { assert.equal(result.status, 503); assert.equal(result.body.billUrl, undefined) }
    else { assert.equal(result.status, 200); assert.equal(events.join(','), 'insert,gateway,link') }
    if (['readiness', 'insert'].includes(failure)) assert.ok(!events.includes('gateway'))
  }
})