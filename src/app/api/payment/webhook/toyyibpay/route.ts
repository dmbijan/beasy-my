import { NextRequest, NextResponse } from 'next/server'
import { PaymentError, verifyAndSettle } from '@/lib/payment-service'
import { validBillCode } from '@/lib/toyyibpay'

export async function POST(request: NextRequest) {
  try {
    const body = await request.formData()
    const billCode = body.get('billcode') ?? body.get('BillCode') ?? body.get('bill_code')
    if (!validBillCode(billCode)) return NextResponse.json({ error: 'Invalid bill code' }, { status: 400 })
    // Callback is only a signal: ignore its amount, status, Remark and buyer details.
    const status = await verifyAndSettle(billCode)
    return NextResponse.json({ status })
  } catch (error) {
    console.error('Payment webhook failed:', error)
    return NextResponse.json({ error: 'Payment verification incomplete' },
      { status: error instanceof PaymentError ? error.status : 502 })
  }
}
