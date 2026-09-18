// Wedding checklist catalog — inspired by MajlisKenduri's "Nikah forms, hantaran,
// one list" feature. The SPPIM (Sistem Pengurusan Perkahwinan Islam Malaysia)
// kebenaran berkahwin workflow + common Malaysian wedding planning categories.
// Stored as static data; hosts check off items from their phone.

export interface ChecklistItem {
  id: string
  label: string
  category: string
  // Optional external link (e.g. SPPIM online form).
  link?: string
}

export interface ChecklistCategory {
  id: string
  name: string
  icon: string
}

export const checklistCategories: ChecklistCategory[] = [
  { id: 'nikah', name: 'Permohonan Nikah', icon: '📋' },
  { id: 'venue', name: 'Venue / Dewan', icon: '🏛️' },
  { id: 'food', name: 'Katering / Makanan', icon: '🍽️' },
  { id: 'protocol', name: 'Protokol / Adat', icon: '🎎' },
  { id: 'attire', name: 'Pakaian / Andam', icon: '👰' },
  { id: 'media', name: 'Media / Fotografi', icon: '📷' },
  { id: 'entertainment', name: 'Hiburan', icon: '🎵' },
  { id: 'transport', name: 'Pengangkutan', icon: '🚗' },
  { id: 'souvenirs', name: 'Cenderamata / Doorgift', icon: '🎁' },
  { id: 'budget', name: 'Belanjawan', icon: '💰' },
  { id: 'guest', name: 'Tetamu / Jemputan', icon: '👥' },
  { id: 'decor', name: 'Dekorasi', icon: '💐' },
  { id: 'hantaran', name: 'Hantaran', icon: '💝' },
]

// 33 items across 13 categories.
export const weddingChecklist: ChecklistItem[] = [
  // Permohonan Nikah (SPPIM) — 6 langkah + dokumen
  { id: 'nikah-1', label: 'Cipta Permohonan Kebenaran Kahwin', category: 'nikah', link: 'https://sppim.jais.gov.my' },
  { id: 'nikah-2', label: 'Lengkapkan Permohonan (maklumat pengantin)', category: 'nikah' },
  { id: 'nikah-3', label: 'Muat Turun Borang Permohonan', category: 'nikah' },
  { id: 'nikah-4', label: 'Dapatkan Pengesahan Kebenaran Berkahwin', category: 'nikah' },
  { id: 'nikah-5', label: 'Hantar Permohonan ke Pejabat Agama', category: 'nikah' },
  { id: 'nikah-6', label: 'Hadir ke Pejabat Agama (temuduga/verifikasi)', category: 'nikah' },
  { id: 'nikah-7', label: 'Sediakan kad pengenalan pengantin & saksi', category: 'nikah' },
  { id: 'nikah-8', label: 'Sediakan surat akuan bujang / cerai (jika berkenaan)', category: 'nikah' },
  // Venue
  { id: 'venue-1', label: 'Tempah dewan / lokasi majlis', category: 'venue' },
  { id: 'venue-2', label: 'Tempah canopy / khemah (jika luar)', category: 'venue' },
  { id: 'venue-3', label: 'Urus permit majlis (jika perlu)', category: 'venue' },
  // Food
  { id: 'food-1', label: 'Tempah katering', category: 'food' },
  { id: 'food-2', label: 'Sahkan menu & bilangan pax', category: 'food' },
  // Protocol
  { id: 'protocol-1', label: 'Urus tok kadi / jurunikah', category: 'protocol' },
  { id: 'protocol-2', label: 'Tentukan mas kahwin & hantaran', category: 'protocol' },
  // Attire
  { id: 'attire-1', label: 'Tempah baju pengantin', category: 'attire' },
  { id: 'attire-2', label: 'Tempah mak andam / MUA', category: 'attire' },
  { id: 'attire-3', label: 'Fitting akhir pakaian', category: 'attire' },
  // Media
  { id: 'media-1', label: 'Tempah jurugambar / juruvideo', category: 'media' },
  { id: 'media-2', label: 'Bincang shot list & lokasi', category: 'media' },
  // Entertainment
  { id: 'ent-1', label: 'Tempah PA system / DJ / kompang', category: 'entertainment' },
  // Transport
  { id: 'transport-1', label: 'Tempah kereta pengantin', category: 'transport' },
  // Souvenirs
  { id: 'souvenir-1', label: 'Tempah doorgift / cenderamata', category: 'souvenirs' },
  // Budget
  { id: 'budget-1', label: 'Sediakan bajet keseluruhan', category: 'budget' },
  { id: 'budget-2', label: 'Agih deposit & bayaran vendor', category: 'budget' },
  // Guest
  { id: 'guest-1', label: 'Sediakan senarai tetamu', category: 'guest' },
  { id: 'guest-2', label: 'Hantar jemputan digital (Beasy)', category: 'guest' },
  { id: 'guest-3', label: 'Tracking RSVP & kehadiran', category: 'guest' },
  // Decor
  { id: 'decor-1', label: 'Tempah pelamin & dekorasi', category: 'decor' },
  { id: 'decor-2', label: 'Tempah bunga / gubahan', category: 'decor' },
  // Hantaran
  { id: 'hantaran-1', label: 'Sediakan dulang hantaran', category: 'hantaran' },
  { id: 'hantaran-2', label: 'Sahkan bilangan & barang hantaran', category: 'hantaran' },
]

export function checklistByCategory(categoryId: string): ChecklistItem[] {
  return weddingChecklist.filter(item => item.category === categoryId)
}
