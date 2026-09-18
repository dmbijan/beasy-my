export async function POST() {
  return Response.json({ error: 'Gunakan pautan pengesahan yang dihantar ke e-mel anda.' }, { status: 410 })
}
