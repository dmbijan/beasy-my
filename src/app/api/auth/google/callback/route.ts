import { NextResponse } from 'next/server'

// Only NextAuth may exchange Google codes and bind tokens to an authenticated host.
export async function GET() {
  return NextResponse.json({
    error: 'Callback Google lama telah ditamatkan. Sila sambungkan Google melalui NextAuth di /auth/signin.',
    signInUrl: '/auth/signin',
  }, { status: 410, headers: { 'Cache-Control': 'no-store' } })
}
