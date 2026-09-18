import { google } from 'googleapis'
import { supabaseAdmin } from './supabase'
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto'
import { Readable } from 'node:stream'

// ⚠️ SECURITY FIX #5: Encrypt Google tokens at rest in database
// Tokens are stored encrypted — even DB dump cannot expose user Drive access
const ENCRYPTION_ALGORITHM = 'aes-256-gcm'
const ENCRYPTION_KEY = process.env.GOOGLE_TOKENS_ENCRYPTION_KEY || ''

if (!ENCRYPTION_KEY) {
  console.warn('⚠️ GOOGLE_TOKENS_ENCRYPTION_KEY not set — Google tokens will NOT be encrypted')
}

/**
 * Encrypt a plaintext string using AES-256-GCM
 */
function encryptToken(plaintext: string): string | null {
  if (!ENCRYPTION_KEY) return plaintext // Fallback if key not set (dev mode)

  try {
    const key = Buffer.from(scryptSync(ENCRYPTION_KEY, 'salt', 32).slice(0, 32))
    const iv = randomBytes(12) // 96-bit IV for GCM
    const cipher = createCipheriv(ENCRYPTION_ALGORITHM, key, iv)

    let encrypted = cipher.update(plaintext, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    const authTag = cipher.getAuthTag().toString('hex')

    // Format: iv:authTag:encrypted (all hex)
    return `${iv.toString('hex')}:${authTag}:${encrypted}`
  } catch (error) {
    console.error('Token encryption failed:', error)
    throw new Error('Google token encryption failed')
  }
}

/**
 * Decrypt an encrypted token string
 */
function decryptToken(encrypted: string): string | null {
  if (!ENCRYPTION_KEY || !encrypted.includes(':')) return encrypted // Already plaintext or no key

  try {
    const [ivHex, authTagHex, ...encryptedParts] = encrypted.split(':')
    const encryptedText = encryptedParts.join(':')

    const key = Buffer.from(scryptSync(ENCRYPTION_KEY, 'salt', 32).slice(0, 32))
    const iv = Buffer.from(ivHex, 'hex')
    const authTag = Buffer.from(authTagHex, 'hex')

    const decipher = createDecipheriv(ENCRYPTION_ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  } catch (error) {
    console.error('Token decryption failed:', error)
    return null // Return null on failure — forces re-authentication
  }
}

/**
 * Store OAuth tokens encrypted in Supabase
 */
export async function storeTokensEncrypted(hostId: string, accessToken: string, refreshToken: string, expiryDate: Date): Promise<void> {
  if (!ENCRYPTION_KEY && process.env.NODE_ENV === 'production') throw new Error('Google token encryption key is required')
  const encryptedAccess = encryptToken(accessToken)
  const encryptedRefresh = encryptToken(refreshToken)

  const { error } = await supabaseAdmin
    .from('google_tokens')
    .upsert({
      host_id: hostId,
      access_token: encryptedAccess,
      refresh_token: encryptedRefresh,
      token_expiry: expiryDate.toISOString(),
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'host_id',
    })
  if (error) throw new Error('Failed to store Google tokens')
}

function createOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/google'
  )
}

export async function setOAuthTokens(refreshToken: string) {
  const client = createOAuthClient()
  client.setCredentials({ refresh_token: refreshToken })
  return client
}

async function getHostOAuthClient(hostId: string) {
  if (!hostId) throw new Error('Host ID is required')
  const oauth2Client = createOAuthClient()
  const { data: tokenData, error } = await supabaseAdmin
    .from('google_tokens')
    .select('access_token, refresh_token, token_expiry')
    .eq('host_id', hostId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !tokenData) {
    throw new Error('Google tokens not found for this host')
  }

  const accessToken = tokenData.access_token ? decryptToken(tokenData.access_token) : null
  const refreshToken = tokenData.refresh_token ? decryptToken(tokenData.refresh_token) : null
  if (!accessToken || !refreshToken) throw new Error('Please reconnect your Google account')

  // Auto-refresh if expired
  const expiry = new Date(tokenData.token_expiry).getTime()
  if (!Number.isFinite(expiry) || expiry <= Date.now() + 60000) {
    try {
      oauth2Client.setCredentials({ refresh_token: refreshToken })
      const { credentials } = await oauth2Client.refreshAccessToken()
      if (!credentials.access_token) throw new Error('Missing refreshed access token')
      
      // ✅ Re-encrypt and store refreshed tokens
      await storeTokensEncrypted(
        hostId,
        credentials.access_token!,
        credentials.refresh_token || refreshToken,
        new Date(credentials.expiry_date || Date.now() + 3600000)
      )

      oauth2Client.setCredentials({ ...credentials, refresh_token: credentials.refresh_token || refreshToken })
    } catch (refreshError) {
      console.error('Failed to refresh Google token')
      throw new Error('Google authentication expired. Please reconnect your account.')
    }
  } else {
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    })
  }

  return oauth2Client
}

export async function getGoogleDriveClient(hostId: string) {
  return google.drive({ version: 'v3', auth: await getHostOAuthClient(hostId) })
}

export function hasActiveDrivePremium(profile: { is_premium?: boolean; premium_expires_at?: string | null } | null): boolean {
  return profile?.is_premium === true &&
    (profile.premium_expires_at == null || Date.parse(profile.premium_expires_at) > Date.now())
}

export async function createEventFolderStructure(
  hostId: string,
  eventTitle: string
): Promise<{ rootFolderId: string; eventFolderId: string }> {
  const drive = await getGoogleDriveClient(hostId)

  // Search for existing "Beasy Events" root folder
  const rootSearch = await drive.files.list({
    q: "name = 'Beasy Events' and mimeType = 'application/vnd.google-apps.folder' and trashed = false",
    spaces: 'drive',
    fields: 'files(id, name)',
  })

  let rootFolderId = rootSearch.data.files?.[0]?.id

  if (!rootFolderId) {
    const rootFolder = await drive.files.create({
      requestBody: {
        name: 'Beasy Events',
        mimeType: 'application/vnd.google-apps.folder',
        description: 'Root folder for Beasy.my events',
      },
      fields: 'id',
    })
    rootFolderId = rootFolder.data.id!
  }

  // Create event folder under root
  const eventFolder = await drive.files.create({
    requestBody: {
      name: `${eventTitle}`,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [rootFolderId],
    },
    fields: 'id',
  })
  const eventFolderId = eventFolder.data.id!

  // Create sub-folders
  const subFolders = ['📸 Live Photo Wall', '🎙️ Audio Guestbook', '🎥 Video Guestbook', '🤖 AI Photos']
  for (const name of subFolders) {
    await drive.files.create({
      requestBody: {
        name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [eventFolderId],
      },
      fields: 'id',
    })
  }

  return { rootFolderId, eventFolderId }
}

export async function uploadFileToDrive(
  hostId: string,
  parentFolderId: string,
  file: {
    name: string
    mimeType: string
    buffer: Buffer
  },
  isPublic: boolean = true
) {
  const drive = await getGoogleDriveClient(hostId)

  const driveResponse = await drive.files.create({
    requestBody: {
      name: file.name,
      mimeType: file.mimeType,
      parents: [parentFolderId],
    },
    media: {
      mimeType: file.mimeType,
      body: Readable.from([file.buffer]),
    },
    fields: 'id, webViewLink, webContentLink',
  })

  // Make publicly accessible if needed
  if (isPublic && driveResponse.data.id) {
    await drive.permissions.create({
      fileId: driveResponse.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
      fields: 'id',
    })
  }

  return {
    fileId: driveResponse.data.id,
    webViewLink: driveResponse.data.webViewLink,
    webContentLink: driveResponse.data.webContentLink,
  }
}

export async function appendToGoogleSheet(
  hostId: string,
  spreadsheetId: string,
  range: string,
  values: any[][]
) {
  const oauth2Client = await getHostOAuthClient(hostId)

  const sheets = google.sheets({ version: 'v4', auth: oauth2Client })

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    requestBody: { values },
  })

  return response.data
}

export async function createRSVPSpreadsheet(
  hostId: string,
  eventTitle: string
): Promise<string> {
  const sheets = google.sheets({ version: 'v4', auth: await getHostOAuthClient(hostId) })

  // Create new spreadsheet
  const spreadsheet = await sheets.spreadsheets.create({
    requestBody: {
      properties: {
        title: `📊 RSVP & Attendance - ${eventTitle}`,
      },
      sheets: [
        {
          properties: {
            title: 'RSVP',
            gridProperties: {
              rowCount: 1000,
              columnCount: 10,
            },
          },
        },
      ],
    },
  })

  const spreadsheetId = spreadsheet.data.spreadsheetId!

  // Add headers
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: 'A1:H1',
    valueInputOption: 'RAW',
    requestBody: {
      values: [
        ['Timestamp', 'Guest Name', 'Phone Number', 'PAX', 'Status', 'QR Hash', 'Checked In', 'Checked In At'],
      ],
    },
  })

  // RSVP personal data stays private to the host.

  return spreadsheetId
}

/**
 * Export all RSVPs for an event to a Google Sheet
 * Creates a new spreadsheet or appends to existing one
 */
export async function exportRSVPsToGoogleSheet(
  hostId: string,
  eventId: string,
  eventTitle: string,
  rsvps: Array<{
    guest_name: string
    phone_number?: string
    pax: number
    attendance_status: string
    qr_code_hash?: string
    checked_in: boolean
    checked_in_at?: string
    created_at: string
  }>
): Promise<{ spreadsheetId: string; success: boolean }> {
  try {
    const sheets = google.sheets({ version: 'v4', auth: await getHostOAuthClient(hostId) })

    // Create new spreadsheet with RSVP and Summary tabs
    const spreadsheet = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: `📊 RSVP Export - ${eventTitle} (${new Date().toISOString().split('T')[0]})`,
        },
        sheets: [
          {
            properties: {
              title: 'RSVP Data',
              gridProperties: {
                rowCount: Math.max(1000, rsvps.length + 10),
                columnCount: 10,
              },
            },
          },
          {
            properties: {
              title: 'Summary',
              gridProperties: {
                rowCount: 10,
                columnCount: 5,
              },
            },
          },
        ],
      },
    })

    const spreadsheetId = spreadsheet.data.spreadsheetId!

    // Headers for RSVP Data tab
    const rsvpHeaders = [
      'No.',
      'Nama Tetamu',
      'Nombor Telefon',
      'Bilangan Pax',
      'Status Kehadiran',
      'QR Code Hash',
      'Sudah Check-in',
      'Masa Check-in',
      'Tarikh RSVP',
    ]

    // Write RSVP headers
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "'RSVP Data'!A1:I1",
      valueInputOption: 'RAW',
      requestBody: {
        values: [rsvpHeaders],
      },
    })

    // Prepare RSVP data rows
    const rsvpRows = rsvps.map((rsvp, index) => [
      (index + 1).toString(),
      rsvp.guest_name,
      rsvp.phone_number || '',
      rsvp.pax.toString(),
      rsvp.attendance_status,
      rsvp.qr_code_hash || '',
      rsvp.checked_in ? 'Ya' : 'Tidak',
      rsvp.checked_in_at || '',
      new Date(rsvp.created_at).toLocaleString('ms-MY'),
    ])

    // Write RSVP data if exists
    if (rsvpRows.length > 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `'RSVP Data'!A2:I${rsvpRows.length + 1}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: rsvpRows,
        },
      })
    }

    // Calculate summary stats
    const totalRSVPs = rsvps.length
    const totalPax = rsvps.reduce((sum, r) => sum + r.pax, 0)
    const checkedInCount = rsvps.filter(r => r.checked_in).length
    const pendingCount = rsvps.filter(r => r.attendance_status === 'pending').length

    // Write Summary tab
    const summaryHeaders = ['Metric', 'Value']
    const summaryData = [
      ['Total RSVP', totalRSVPs],
      ['Jumlah Pax', totalPax],
      ['Sudah Check-in', checkedInCount],
      ['Pending', pendingCount],
      ['Peratus Check-in', `${totalRSVPs > 0 ? Math.round((checkedInCount / totalRSVPs) * 100) : 0}%`],
      ['Tarikh Export', new Date().toLocaleString('ms-MY')],
    ]

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Summary!A1:B${summaryData.length + 1}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [summaryHeaders, ...summaryData],
      },
    })

    // Do not grant public access to guest names, phone numbers or QR hashes.

    return { spreadsheetId, success: true }
  } catch (error) {
    console.error('Export RSVPs to Google Sheet error:', error)
    throw new Error(`Gagal export RSVP ke Google Sheets: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Get RSVP data from Supabase for export
 */
export async function getRSVPsForExport(eventId: string): Promise<Array<{
  id: string
  guest_name: string
  phone_number?: string
  pax: number
  attendance_status: string
  qr_code_hash?: string
  checked_in: boolean
  checked_in_at?: string
  created_at: string
}>> {
  const { data: rsvps, error } = await supabaseAdmin
    .from('rsvps')
    .select('id, guest_name, phone_number, pax, attendance_status, qr_code_hash, checked_in, checked_in_at, created_at')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch RSVPs: ${error.message}`)
  }

  return rsvps || []
}

/**
 * List media files (photos, videos, audio) in an event's Drive folder.
 * Returns publicly viewable links so the live hall display / slideshow can render.
 */
export async function listEventMedia(
  hostId: string,
  driveFolderId: string,
  limit = 500
): Promise<Array<{ id: string; name: string; mimeType: string; kind: 'photo' | 'video' | 'audio'; link: string; thumbnail?: string }>> {
  const drive = await getGoogleDriveClient(hostId)

  const response = await drive.files.list({
    q: `'${driveFolderId}' in parents and trashed = false`,
    spaces: 'drive',
    fields: 'files(id, name, mimeType, webContentLink, webViewLink, thumbnailLink)',
    pageSize: limit,
    orderBy: 'createdTime desc',
  })

  const files = response.data.files || []

  return files
    .filter(file => {
      const mime = file.mimeType || ''
      return mime.startsWith('image/') || mime.startsWith('video/') || mime.startsWith('audio/')
    })
    .map(file => {
      const mime = file.mimeType || ''
      const kind: 'photo' | 'video' | 'audio' = mime.startsWith('image/') ? 'photo' : mime.startsWith('video/') ? 'video' : 'audio'
      // Use the direct download proxy link for images/videos; fall back to webContentLink.
      const link = file.webContentLink || `https://drive.google.com/uc?export=download&id=${file.id}`
      return {
        id: file.id!,
        name: file.name || '',
        mimeType: mime,
        kind,
        link,
        thumbnail: file.thumbnailLink || undefined,
      }
    })
}
