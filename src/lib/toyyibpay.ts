// createBill uses sen; getBillTransactions returns MYR decimal amounts.
export const PREMIUM_PRICE = 159
export const validBillCode = (value: unknown): value is string =>
  typeof value === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(value)

export function myrToSen(value: unknown): number | null {
  if (typeof value !== 'string' && typeof value !== 'number') return null
  const text = String(value)
  if (!/^\d+(\.\d{1,2})?$/.test(text)) return null
  const [whole, fraction = ''] = text.split('.')
  const sen = Number(whole) * 100 + Number(fraction.padEnd(2, '0'))
  return Number.isSafeInteger(sen) ? sen : null
}

function gatewayBase() {
  const url = new URL(process.env.TOYYIBPAY_BASE_URL || 'https://dev.toyyibpay.com/index.php/api')
  if (url.protocol !== 'https:' || !['toyyibpay.com', 'dev.toyyibpay.com'].includes(url.hostname) || url.port || url.username || url.password) {
    throw new Error('Invalid ToyyibPay configuration')
  }
  return url
}

async function gatewayRequest(endpoint: string, payload: Record<string, string>): Promise<unknown> {
  const secret = process.env.TOYYIBPAY_SECRET_KEY
  if (!secret) throw new Error('ToyyibPay is not configured')
  const response = await fetch(`${gatewayBase().href.replace(/\/$/, '')}/${endpoint}`, {
    method: 'POST', body: new URLSearchParams({ ...payload, userSecretKey: secret }),
    cache: 'no-store', signal: AbortSignal.timeout(15000), redirect: 'error',
  })
  if (!response.ok) throw new Error('Gateway request failed')
  return response.json()
}

type Row = Record<string, unknown>
const object = (value: unknown): Row => value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Row : {}

export function normalizeBillResult(value: unknown) {
  const row = object(Array.isArray(value) && value.length === 1 ? value[0] : value)
  const billCode = row.BillCode ?? row.bill_code
  if (!validBillCode(billCode)) throw new Error('Invalid gateway bill response')
  return { billCode, billUrl: `${gatewayBase().origin}/${billCode}` }
}

export async function createToyyibPayBill(params: {
  description: string; amount: number; email: string; name: string
  callbackUrl: string; returnUrl: string; orderId: string
}) {
  const amount = myrToSen(params.amount)
  const category = process.env.TOYYIBPAY_CATEGORY_CODE
  if (!category || !amount) throw new Error('Invalid bill configuration')
  return normalizeBillResult(await gatewayRequest('createBill', {
    categoryCode: category, billName: 'Beasy Premium', billDescription: params.description,
    billAmount: String(amount), billEmail: params.email, billPhone: '', billTo: params.name,
    billPaymentChannel: '0', billPriceSetting: '1', billPayorInfo: '1',
    billReturnUrl: params.returnUrl, billCallbackUrl: params.callbackUrl,
    billExternalReferenceNo: params.orderId, billChargeToCustomer: '2',
  }))
}

export type VerifiedTransaction = {
  status: 'paid' | 'pending' | 'failed' | 'unknown'
  amountSen: number | null; paymentId: string | null; referenceId: string | null
}

export function normalizeTransactions(value: unknown, billCode: string, expectedSen: number): VerifiedTransaction {
  const wrapper = object(value)
  const rows = Array.isArray(value) ? value : wrapper.code == 200 && Array.isArray(wrapper.transactions) ? wrapper.transactions : null
  if (!rows) throw new Error('Invalid gateway transactions response')
  const transactions = rows.map(object).filter(row => {
    const code = row.billcode ?? row.BillCode ?? row.bill_code
    // Native rows omit billcode; the authenticated request itself is bill-scoped.
    return code === undefined || code === billCode
  }).map(row => {
    const raw = String(row.billpaymentStatus ?? row.billpaymentstatus ?? row.billPaymentStatus ?? row.status_id ?? row.status ?? '')
    const status: VerifiedTransaction['status'] = raw === '1' ? 'paid' : raw === '2' ? 'pending' : ['3', '4'].includes(raw) ? 'failed' : 'unknown'
    const id = row.billpaymentInvoiceNo ?? row.payment_id ?? row.paymentid
    const ref = row.billpaymentReferenceNo ?? row.reference_id
    return { status, amountSen: myrToSen(row.billpaymentAmount ?? row.billamount ?? row.billAmount ?? row.amount),
      paymentId: typeof id === 'string' && id.length > 0 ? id : null,
      referenceId: typeof ref === 'string' ? ref : null }
  })
  const paid = transactions.filter(tx => tx.status === 'paid')
  const successful = paid.find(tx => tx.amountSen === expectedSen && tx.paymentId)
  if (successful) return successful
  if (paid.length) throw new Error('Successful transaction amount or identity does not match order')
  return transactions.find(tx => tx.status === 'pending') ?? transactions.find(tx => tx.status === 'failed') ??
    { status: 'unknown', amountSen: null, paymentId: null, referenceId: null }
}

export async function getBillStatus(billCode: string, expectedSen: number) {
  if (!validBillCode(billCode)) throw new Error('Invalid bill code')
  return normalizeTransactions(await gatewayRequest('getBillTransactions', { billCode }), billCode, expectedSen)
}
