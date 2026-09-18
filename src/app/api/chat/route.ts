import { NextRequest, NextResponse } from 'next/server'

// Chat AI endpoint — uses an OpenAI-compatible LLM if OPENAI_API_KEY is set,
// otherwise falls back to a deterministic rule-based answer on the client.
// We never expose the key; it stays server-side.

interface ChatBody {
  message: string
  event?: {
    title: string
    eventDate: string
    venueName: string
    venueAddress: string
    dressCode: string
    description: string
  }
}

function fallbackAnswer(message: string, event?: ChatBody['event']): string {
  const q = message.toLowerCase()
  const dateStr = event?.eventDate ? new Date(event.eventDate).toLocaleDateString('ms-MY', { dateStyle: 'full', timeStyle: 'short' }) : ''
  const venue = event?.venueName || 'belum ditetapkan'
  const address = event?.venueAddress || ''
  const dress = event?.dressCode || 'tiada ketetapan khas'
  const title = event?.title || 'majlis ini'

  if (/(tarikh|bila|date|when)/.test(q)) return `Majlis ${title} akan diadakan pada ${dateStr}.`
  if (/(lokasi|mana|venue|location|alamat|address)/.test(q)) return `Lokasi majlis: ${venue}${address ? ` (${address})` : ''}.`
  if (/(pakaian|dress|pakai|baju)/.test(q)) return `Etika pakaian: ${dress}.`
  if (/(assalam|salam|hai|hello|hi|helo)/.test(q) && q.length < 20) return `Waalaikumsalam! Saya Chat AI untuk majlis ${title}. Tanya saya tentang tarikh, lokasi atau pakaian.`
  if (/(rsvp|hadir|confirm|kehadiran)/.test(q)) return 'Sila gunakan butang RSVP untuk sahkan kehadiran anda.'
  if (/(wishlist|hadiah|gift)/.test(q)) return 'Semak bahagian Wishlist Hadiah untuk senarai hadiah yang diidamkan pasangan.'
  if (/(lagu|muzik|song|music)/.test(q)) return 'Anda boleh mencadangkan lagu di bahagian Song Request.'
  if (/(angpao|duit|wang|money|salam kaut|bank)/.test(q)) return 'Maklumat angpao / duit salam boleh didapati di bahagian Angpao kad ini.'
  if (/(ucapan|doa|wish)/.test(q)) return 'Tinggalkan ucapan dan doa anda di bahagian Ucapan.'
  return `Untuk maklumat lanjut tentang ${title}, anda boleh tanya saya tentang tarikh, lokasi, pakaian, atau hubungi tuan rumah.`
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as ChatBody | null
    if (!body || typeof body.message !== 'string' || body.message.trim().length === 0) {
      return NextResponse.json({ error: 'Mesej diperlukan' }, { status: 400 })
    }
    const message = body.message.trim().slice(0, 500)

    const apiKey = process.env.OPENAI_API_KEY
    // If no LLM key is configured, fall back to the rule-based answer.
    if (!apiKey) {
      return NextResponse.json({ reply: fallbackAnswer(message, body.event), source: 'rule' })
    }

    const system = `Anda ialah "Chat AI" untuk kad jemputan digital. Jawab soalan tetamu dalam Bahasa Melayu, ringkas dan mesra. Maklumat majlis: ${JSON.stringify(body.event || {})}`
    const response = await fetch(`${process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [{ role: 'system', content: system }, { role: 'user', content: message }],
        max_tokens: 200,
        temperature: 0.4,
      }),
      signal: AbortSignal.timeout(15000),
    })

    if (!response.ok) {
      // LLM unavailable — gracefully fall back.
      return NextResponse.json({ reply: fallbackAnswer(message, body.event), source: 'rule' })
    }

    const data = await response.json()
    const reply = data?.choices?.[0]?.message?.content?.trim()
    if (!reply) return NextResponse.json({ reply: fallbackAnswer(message, body.event), source: 'rule' })
    return NextResponse.json({ reply, source: 'llm' })
  } catch {
    // Network/parse error — fall back.
    try {
      const body = (await req.clone().json().catch(() => null)) as ChatBody | null
      return NextResponse.json({ reply: fallbackAnswer(body?.message || '', body?.event), source: 'rule' })
    } catch {
      return NextResponse.json({ error: 'Gagal memproses soalan' }, { status: 500 })
    }
  }
}
