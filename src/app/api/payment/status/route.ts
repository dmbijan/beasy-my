import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { paymentOwner, PaymentError } from '@/lib/payment-service'
import { validBillCode } from '@/lib/toyyibpay'

export async function GET(request: NextRequest) {
  try {
    const owner = await paymentOwner()
    const billCode = request.nextUrl.searchParams.get('billCode')
    const orderId = request.nextUrl.searchParams.get('orderId')
    if ((billCode !== null && !validBillCode(billCode)) || (orderId !== null && !/^[0-9a-f-]{36}$/i.test(orderId))) {
      throw new PaymentError('Invalid payment reference', 400)
    }
    const fields = 'id, status, toyyibpay_bill_code, amount, currency, paid_at'
    let query = supabaseAdmin.from('payments').select(fields).eq('host_id', owner.id)
    if (orderId) query = query.eq('id', orderId)
    else if (billCode) query = query.eq('toyyibpay_bill_code', billCode)
    else {
      const { data: paid, error } = await supabaseAdmin.from('payments').select(fields)
        .eq('host_id', owner.id).eq('status', 'paid').order('paid_at', { ascending: false }).limit(1).maybeSingle()
      if (error) throw new PaymentError('Payment lookup failed')
      if (paid) return NextResponse.json(paid, { headers: { 'Cache-Control': 'no-store' } })
    }
    const { data, error } = await query.order('created_at', { ascending: false }).limit(1).maybeSingle()
    if (error) throw new PaymentError('Payment lookup failed')
    if (!data && (billCode || orderId)) throw new PaymentError('Payment not found', 404)
    return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    return NextResponse.json({ error: error instanceof PaymentError ? error.message : 'Payment status unavailable' },
      { status: error instanceof PaymentError ? error.status : 503, headers: { 'Cache-Control': 'no-store' } })
  }
}
