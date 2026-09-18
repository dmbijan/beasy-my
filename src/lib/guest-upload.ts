// Browser-only upload helpers: never fabricate a Drive identifier or mutate storage directly.
export function resolveGuestUploadSlug(eventId?: string, eventSlug?: string) {
  if (!eventId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(eventId)) {
    throw new Error('Muat naik tidak tersedia untuk demo atau acara lama. Buka pautan acara sebenar.')
  }
  const slug = eventSlug?.trim()
  if (!slug || slug.length > 100 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error('Pautan acara tidak lengkap. Muat semula halaman acara atau hubungi tuan rumah.')
  }
  return slug
}

export type GuestUploadKind = 'photo' | 'audio' | 'video'

export function validateGuestFile(file: Blob, kind: GuestUploadKind) {
  const mime = file.type.split(';')[0].trim().toLowerCase()
  const types =
    kind === 'photo' ? ['image/jpeg', 'image/png', 'image/webp']
    : kind === 'audio' ? ['audio/webm', 'audio/ogg', 'audio/mp4', 'audio/mpeg', 'audio/wav']
    : ['video/webm', 'video/mp4', 'video/quicktime']
  const errorText =
    kind === 'photo' ? 'Pilih gambar JPEG, PNG atau WebP.'
    : kind === 'audio' ? 'Format audio tidak disokong.'
    : 'Format video tidak disokong.'
  if (!types.includes(mime)) throw new Error(errorText)
  if (!file.size) throw new Error('Fail kosong. Sila cuba lagi.')
  // Video: up to 250MB (2-minute clips are enforced at the recorder, but we
  // allow a generous size ceiling to match the MomenSpace guest limit).
  const max = kind === 'photo' ? 10 : kind === 'audio' ? 50 : 250
  if (file.size > max * 1024 * 1024) throw new Error(`Saiz fail melebihi had ${max}MB.`)
}

export async function uploadGuestFile(file: File, kind: GuestUploadKind, eventId?: string, eventSlug?: string, uploaderName?: string) {
  const slug = resolveGuestUploadSlug(eventId, eventSlug)
  validateGuestFile(file, kind)
  const form = new FormData()
  form.append('file', file)
  form.append('eventSlug', slug)
  form.append('eventId', eventId!)
  form.append('uploaderName', uploaderName?.trim() || 'Tetamu')
  const response = await fetch('/api/drive/upload', { method: 'POST', body: form })
  const result = await response.json().catch(() => null)
  if (!response.ok || result?.success !== true || typeof result.fileId !== 'string' || !result.fileId) {
    throw new Error(result?.error || 'Muat naik tidak disahkan. Sila cuba lagi atau hubungi tuan rumah.')
  }
  // Drive web-view links are HTML pages, not image/audio sources.
  return { fileId: result.fileId as string }
}