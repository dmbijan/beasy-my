import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyAndSettle } from '@/lib/payment-service'

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET?.trim()
  return Boolean(secret && request.headers.get('authorization') === `Bearer ${secret}`)
}

export async function POST(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { data, error } = await supabaseAdmin.from('payments')
      .select('id, toyyibpay_bill_code').in('status', ['pending', 'failed'])
      .not('toyyibpay_bill_code', 'is', null)
      .lt('updated_at', new Date(Date.now() - 15 * 60 * 1000).toISOString())
      .order('updated_at', { ascending: true }).limit(50)
    if (error) throw error
    let reconciled = 0
    let failed = 0
    for (const payment of data || []) {
      try {
        if (await verifyAndSettle(payment.toyyibpay_bill_code) === 'paid') reconciled++
      } catch (error) {
        console.error('Reconciliation failed for order:', payment.id, error)
        failed++
      }
      const { error: touchError } = await supabaseAdmin.from('payments')
        .update({ updated_at: new Date().toISOString() }).eq('id', payment.id).in('status', ['pending', 'failed'])
      if (touchError) throw touchError
    }
    return NextResponse.json({ success: failed === 0, reconciled, failed, totalChecked: data?.length || 0 }, { status: failed ? 503 : 200 })
  } catch (error) {
    console.error('Reconciliation unavailable:', error)
    return NextResponse.json({ error: 'Reconciliation unavailable' }, { status: 503 })
  }
}

export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { count, error } = await supabaseAdmin.from('payments').select('id', { count: 'exact', head: true }).eq('status', 'pending')
  if (error) return NextResponse.json({ error: 'Payment statistics unavailable' }, { status: 503 })
  return NextResponse.json({ totalPending: count }, { headers: { 'Cache-Control': 'no-store' } })
}
