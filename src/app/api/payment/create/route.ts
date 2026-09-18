import { NextRequest, NextResponse } from 'next/server'
import { createToyyibPayBill, PREMIUM_PRICE } from '@/lib/toyyibpay'
import { supabaseAdmin } from '@/lib/supabase'
import { paymentOwner, PaymentError } from '@/lib/payment-service'

export async function POST(_request: NextRequest) {
  try {
    const owner = await paymentOwner()
    const { data: ready, error: readinessError } = await supabaseAdmin.rpc('payment_settlement_ready')
    if (readinessError || ready !== true) throw new PaymentError('Pembayaran belum tersedia. Sila cuba kemudian.')
    const base = process.env.NEXT_PUBLIC_URL
    if (!base) throw new PaymentError('Payment URL is not configured')
    const origin = new URL(base).origin
    if (!origin.startsWith('https://') && process.env.NODE_ENV === 'production') throw new PaymentError('HTTPS required')
    const { data: order, error } = await supabaseAdmin.from('payments').insert({
      host_id: owner.id, user_name: owner.full_name || owner.email,
      user_email: owner.email, amount: PREMIUM_PRICE, currency: 'MYR', status: 'pending',
    }).select('id').single()
    if (error || !order) throw new PaymentError('Gagal menyimpan pesanan pembayaran.')
    const bill = await createToyyibPayBill({
      description: 'Beasy.my Premium - 1 year', amount: PREMIUM_PRICE,
      email: owner.email, name: owner.full_name || owner.email, orderId: order.id,
      callbackUrl: `${origin}/api/payment/webhook/toyyibpay`,
      returnUrl: `${origin}/payment/success?orderId=${encodeURIComponent(order.id)}`,
    })
    const { data: saved, error: saveError } = await supabaseAdmin.from('payments')
      .update({ toyyibpay_bill_code: bill.billCode }).eq('id', order.id)
      .eq('status', 'pending').is('toyyibpay_bill_code', null).select('id').single()
    if (saveError || !saved) throw new PaymentError('Gagal menyimpan rujukan bil. Jangan buat pembayaran.')
    return NextResponse.json({ ...bill, paymentId: order.id }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Create payment failed:', error)
    return NextResponse.json({ error: error instanceof PaymentError ? error.message : 'Gagal mencipta bil pembayaran.' },
      { status: error instanceof PaymentError ? error.status : 502 })
  }
}
