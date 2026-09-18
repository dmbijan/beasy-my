import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    name: "Beasy.my API",
    version: "1.0.0",
    status: "running",
    endpoints: [
      "/api/auth/google/callback",
      "/api/events",
      "/api/rsvps",
      "/api/drive/upload",
    ],
  })
}
