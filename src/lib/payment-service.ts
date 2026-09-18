import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { getBillStatus, myrToSen } from '@/lib/toyyibpay'

export class PaymentError extends Error {
  constructor(message: string, public status = 503) { super(message) }
}

export async function paymentOwner() {
  const session = await auth()
  const id = session?.user?.id
  // No email fallback: require a verified profile UUID.
  if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    throw new PaymentError('Sila log masuk dengan akaun yang disahkan.', 401)
  }
  const { data, error } = await supabaseAdmin.from('profiles').select('id, email, full_name').eq('id', id).maybeSingle()
  if (error) throw new PaymentError('Profil pembayaran tidak dapat disemak.')
  if (!data?.email) throw new PaymentError('Profil pembayaran belum tersedia.', 403)
  return data
}

export async function verifyAndSettle(billCode: string) {
  const { data: order, error } = await supabaseAdmin.from('payments')
    .select('id, host_id, amount, currency, status, toyyibpay_bill_code')
    .eq('toyyibpay_bill_code', billCode).maybeSingle()
  if (error) throw new PaymentError('Payment lookup failed')
  if (!order) throw new PaymentError('Payment not found', 404)
  if (!order.host_id || order.currency !== 'MYR') throw new PaymentError('Order requires manual review', 409)
  if (order.status === 'paid' || order.status === 'refunded') return order.status
  const amountSen = myrToSen(order.amount)
  if (!amountSen) throw new PaymentError('Invalid stored order amount', 409)
  const verified = await getBillStatus(billCode, amountSen)
  if (verified.status === 'paid') {
    // Missing migration MUST fail closed; never fall back to separate writes.
    const { data, error: settleError } = await supabaseAdmin.rpc('settle_payment', {
      p_order_id: order.id, p_bill_code: billCode, p_amount_sen: amountSen,
      p_payment_id: verified.paymentId, p_reference_id: verified.referenceId,
    })
    if (settleError || data !== 'paid') throw new PaymentError('Payment settlement unavailable')
    return 'paid'
  }
  if (verified.status === 'failed') {
    const { error: updateError } = await supabaseAdmin.from('payments')
      .update({ status: 'failed', updated_at: new Date().toISOString() })
      .eq('id', order.id).eq('status', 'pending')
    if (updateError) throw new PaymentError('Payment update failed')
  }
  return verified.status
}