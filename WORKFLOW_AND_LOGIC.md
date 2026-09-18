# 📋 Beasy.my - Workflow & Logic Documentation

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS 16.3.5 (Turbopack)               │
│                     App Router + Client Components           │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   Server Side          Middleware Layer      API Routes
   (SSR/SSG)           (Route Protection)    (Backend Logic)
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────────┐  ┌──────────────┐  ┌────────────────────┐
│ Public Pages     │  │ Auth Check   │  │ Supabase Database  │
│ Landing, Event   │  │ Redirects    │  │ - events           │
│                  │  │ Session Mgmt │  │ - profiles         │
└──────────────────┘  └──────────────┘  │ - event_modules    │
                                        │ - rsvps            │
                                        │ - wishes           │
                                        │ - payments         │
                                        └────────────────────┘
```

---

## 🔐 Authentication Flow

### NextAuth v5 Configuration
**File:** `src/lib/auth.ts`

```typescript
// ⚠️ SECURITY FIX #8: Tokens NEVER leave the server.
// We do NOT store accessToken/refreshToken in JWT or session.
// All token operations happen server-side only via Supabase.
export const { auth, signIn, signOut, handlers } = NextAuth({
  providers: [GoogleProvider],
  callbacks: { jwt, session, signIn },
  pages: { signIn: "/auth/signin", error: "/auth/error" }
})

// Export handlers for [...nextauth] route file
export const { GET, POST } = handlers
```

### ⚠️ Security Architecture - Token Isolation

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY BOUNDARY                         │
│                                                              │
│  SERVER SIDE (Secure)              CLIENT SIDE (Exposed)    │
│  ─────────────────────               ────────────────────    │
│  ✓ access_token                      ✗ NO accessToken       │
│  ✓ refresh_token                     ✗ NO refreshToken      │
│  ✓ expiresAt                         ✓ expiresAt            │
│  ✓ scope                             ✓ scope                │
│  ✓ profile data                      ✓ profile data         │
└─────────────────────────────────────────────────────────────┘
```

### Google OAuth Flow (SECURE)
```
User Clicks "Login dengan Google"
         │
         ▼
┌──────────────────────┐
| signIn('google')     |
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
| Google Consent       │ ← prompt: consent, access_type: offline
| (Drive, Email,       │    scope: drive.file, spreadsheets, openid
|  Profile, Sheets)    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
| signIn callback      │
| - Check profiles     │
| - Create if new      │
| - Return true/false  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
| JWT Token Created    │ ⚠️ ONLY metadata stored:
| - expiresAt          │   • expiresAt (timestamp)
| - scope              │   • scope (permission string)
| ⚠️ NO tokens here!   │   ❌ NO access_token
|                      │   ❌ NO refresh_token
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
| Session Provider     │ ⚠️ Safe for browser:
| - user.expiresAt     │   • expiresAt
| - user.scope         │   • scope
| - user.profile       │   • name, email, image
| ❌ NO tokens exposed │   ❌ NO accessToken
└──────────────────────┘
```

### JWT Callback (Security Fixed)
```typescript
async jwt({ token, account }) {
  if (account) {
    token.expiresAt = account.expires_at as number
    token.scope = account.scope as string
    // ⚠️ DO NOT store access_token or refresh_token here
    // They are exchanged server-side when needed for Drive API
  }
  return token
}
```

### Session Callback (Security Fixed)
```typescript
async session({ session, token }) {
  if (session.user) {
    // ⚠️ NO tokens exposed to browser/client code
    session.user.expiresAt = token.expiresAt as number
    session.user.scope = token.scope as string
    // ❌ NO session.user.accessToken
    // ❌ NO session.user.refreshToken
  }
  return session
}
```

### Protected Routes (Middleware)
**File:** `src/middleware.ts`

```
Request → /dashboard/* or /auth/*
         │
         ├─ Is /dashboard/create? → ✅ Allow (anonymous)
         │
         ├─ Is protected route?
         │    │
         │    ├─ Has session? → ✅ Continue
         │    └─ No session? → 🔀 Redirect to /auth/signin
         │
         └─ Is auth route?
              │
              ├─ Has session? → 🔀 Redirect to /dashboard
              └─ No session? → ✅ Continue
```

**Route Classification:**
| Route Pattern | Auth Required | Description |
|--------------|---------------|-------------|
| `/dashboard/create` | ❌ No | Free event creation (anonymous) |
| `/dashboard/*` (except create) | ✅ Yes | Dashboard features |
| `/auth/signin` | ❌ No (redirect if logged in) | Sign in page |
| `/e/[slug]` | ❌ No | Public event portal |
| `/api/payment/webhook/*` | ❌ No | Payment webhooks (verified by signature) |
| All other routes | ❌ No | Public pages |

### Rate Limiting (Security Fixed)
Public endpoints now have rate limiting to prevent abuse:

| Endpoint | Rate Limit | Purpose |
|----------|------------|---------|
| `/api/wishes` | 30 req/min/IP | Prevent spam wishes |
| `/api/rsvps` | 20 req/min/IP | Prevent RSVP flooding |
| `/api/media` | 50 results max | Limit data exposure |

Implementation: In-memory rate limiter with IP tracking.

---

## 🎯 Event Creation Workflow (6-Step Wizard)

### Page: `/dashboard/create`
**File:** `src/app/(dashboard)/dashboard/create/page.tsx`

#### Step-by-Step Flow:

```
┌─────────────────────────────────────────────────────────────┐
│                    CREATE EVENT WIZARD                       │
│                    (Anonymous - No Login Required)            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Butiran Acara                                       │
│ ─────────────────────────────────                           │
│ • Jenis Acara (9 types)                                     │
│ • Nama Acara                                                │
│ • Slug URL (auto-generate unique)                           │
│ • Tarikh & Masa                                             │
│ • Deskripsi (500 chars max)                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Lokasi & Details                                    │
│ ─────────────────────────────────                           │
│ • Nama Venue                                                │
│ • Alamat                                                    │
│ • Pautan Google Maps                                        │
│ • Dress Code                                                │
│ • Tarikh Akhir RSVP                                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Tema & Penyesuaian                                  │
│ ─────────────────────────────────                           │
│ • Pilih Tema (6 options):                                   │
│   - Glass Morphism 🔮                                       │
│   - Elegant Gold 💎                                          │
│   - Modern Dark 🖤                                           │
│   - Nature Green 🌿                                          │
│   - Ocean Blue 🌊                                            │
│   - Sunset Warm 🧡                                           │
│ • Warna Aksen                                               │
│ • Cover Image URL                                           │
│ • LIVE PREVIEW CARD (real-time)                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: Media Sosial                                        │
│ ─────────────────────────────────                           │
│ • Facebook Link                                             │
│ • Instagram Link                                            │
│ • WhatsApp Group Link                                       │
│ • Website Link                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: Digital Angpao 🧧                                   │
│ ─────────────────────────────────                           │
│ • Toggle Enable/Disable                                     │
│ • Jika enabled:                                             │
│   - Bank Name                                               │
│   - Account Number                                          │
│   - Account Name                                            │
│   - DuitNow Number                                          │
│   - DuitNow Name                                            │
│ • Preview Card (live)                                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 6: Google Drive Integration 💎                         │
│ ─────────────────────────────────                           │
│ • Premium Feature (RM159 one-time)                          │
│ • Features List:                                            │
│   - Auto photo backup                                       │
│   - Audio guestbook storage                                 │
│   - Video backup                                            │
│   - Centralized management                                  │
│ • Connect Button → Google OAuth                             │
│ • Folder Structure Preview                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ SUBMIT → POST /api/events/create                            │
└─────────────────────────────────────────────────────────────┘
```

### Form Data Structure
```typescript
interface CreateEventData {
  // Step 1
  title: string
  slug: string
  eventType: 'wedding' | 'birthday' | 'aqiqah' | 'baby-shower' | 
             'corporate' | 'festival' | 'graduation' | 'party' | 'other'
  eventDate: string
  description: string
  
  // Step 2
  venueName: string
  venueAddress: string
  mapsLink: string
  dressCode: string
  rsvpDeadline: string
  
  // Step 3
  theme: 'glass' | 'elegant' | 'modern' | 'nature' | 'ocean' | 'sunset'
  accentColor: string
  coverImage: string
  
  // Step 4
  facebookLink: string
  instagramLink: string
  whatsappLink: string
  websiteLink: string
  
  // Step 5
  angpaoEnabled: boolean
  bankName: string
  accountNumber: string
  accountName: string
  duitNowNumber: string
  duitNowName: string
}
```

---

## 🗄️ API Endpoints

### 1. Create Event (Anonymous)
**Endpoint:** `POST /api/events/create`
**File:** `src/app/api/events/create/route.ts`

```
Request Body:
{
  title, slug, eventType, eventDate,
  description, venueName, venueAddress, mapsLink,
  dressCode, rsvpDeadline, theme, accentColor, coverImage,
  social links, angpao settings
}

Flow:
1. Validate required fields (title, slug, eventType, eventDate)
2. Check slug uniqueness (retry up to 5 times with random suffix)
3. ⚠️ SECURITY FIX #7: Generate unique claim_token (UUID)
4. Insert into events table:
   - is_anonymous: true
   - plan: 'free'
   - claim_token: <UUID> ← NEW!
5. Create default event_modules (RSVP, wishes, photoWall enabled)
6. If angpao enabled → insert angpao module
7. Return event data + claimToken

Response:
{
  success: true,
  event: { id, slug, ... },
  claimToken: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", ← NEW!
  redirectUrl: `/e/${slug}`
}
```

### 2. Claim Event (Authenticated + Token Verified)
**Endpoint:** `POST /api/events/claim`
**File:** `src/app/api/events/claim/route.ts`

```
⚠️ SECURITY FIX #7: Ownership verification with claim_token

Request Body:
{
  eventSlug: string,
  claimToken: string  ← REQUIRED! (from create response)
}

Flow:
1. Verify authentication (session check)
2. Check if event exists and is_anonymous = true
3. ⚠️ VERIFY claim_token matches:
   if (event.claim_token && claimToken !== event.claim_token) {
     return 403 'Token klaim tidak sah'
   }
4. Update events.is_anonymous = false
5. Link events.host_id = session.user.id
6. Remove claim_token (set to null)
7. Return success

Response:
{ 
  success: true, 
  message: "Acara berjaya diklaim",
  event: { ... }
}

Error Responses:
- 401: Sila login terlebih dahulu
- 400: Event slug tidak diberikan
- 403: Token klaim tidak sah ← NEW!
- 404: Acara tidak dijumpai
```

### ⚠️ Security Flow: Event Ownership
```
User Creates Event (Anonymous)
         │
         ▼
┌──────────────────────┐
| POST /api/events/create│
| - Generate claim_token │ ← UUID generated
| - Store in events      │ ← claim_token column
| - Return claim_token   │ ← User must save this!
└──────────┬───────────┘
           │
           │ User saves claim_token securely
           │
           ▼
┌──────────────────────┐
| User decides to claim │
| (login & take ownership)
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
| POST /api/events/claim│
| - eventSlug: "my-event"│
| - claimToken: "xxx..." │ ← Must match!
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
| Server verifies:     │
| event.claim_token ===│
| claimToken ? ✅ OK   │
| : ❌ Reject          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
| Success!             │
| - host_id set        │
| - is_anonymous = false│
| - claim_token = null │ ← Removed
└──────────────────────┘
```

**Why claim_token?**
- Prevents unauthorized claiming of anonymous events
- Even if you know the slug, you need the secret token
- One-time use: token removed after successful claim
- Protects against event hijacking attacks

### 3. Get Session
**Endpoint:** `GET /api/auth/session`
**Handled by:** NextAuth handlers

```
⚠️ SECURITY FIX #8: NO tokens exposed!

Flow:
1. Read session cookie
2. Validate JWT token
3. Return session object or null

⚠️ Response (SECURE):
{
  session: {
    user: {
      id: "...",
      name: "...",
      email: "...",
      image: "...",
      expiresAt: 1234567890,  ← Metadata only
      scope: "openid profile" ← Metadata only
      ❌ NO accessToken
      ❌ NO refreshToken
    }
  }
}

❌ OLD (INSECURE):
{
  session: {
    user: {
      accessToken: "ya29.a0ar...",  ← DANGEROUS!
      refreshToken: "1//0g...",     ← DANGEROUS!
      expiresAt: 1234567890
    }
  }
}
```

### 4. Sign Out
**Endpoint:** `GET /api/auth/signout`
**File:** `src/app/api/auth/signout/route.ts`

```
Flow:
1. Get current session
2. Call signOut({ redirect: false })
3. Clear cookies
4. Redirect to /
```

### 6. Google OAuth Callback
**Endpoint:** `GET/POST /api/auth/callback/google`
**Handled by:** NextAuth handlers (from lib/auth.ts)

```
⚠️ SECURITY FIX #8: Tokens exchanged server-side ONLY

Flow:
1. Receive authorization code from Google
2. Exchange code for tokens at Google OAuth endpoint
3. ⚠️ Store access_token/refresh_token SERVER-SIDE ONLY
   - Used for Drive API calls (server-to-server)
   - NEVER stored in JWT or session
4. Call signIn callback (create/update profile)
5. Redirect to callback URL

Token Storage (Server-Side):
┌──────────────────────────────────────┐
│ JWT Token (Browser)                  │
│ ├─ expiresAt ✅                      │
│ └─ scope ✅                          │
│ ❌ NO access_token                   │
│ ❌ NO refresh_token                  │
├──────────────────────────────────────┤
│ Server Memory (Secure)               │
│ ├─ access_token ✅ (for Drive API)   │
│ └─ refresh_token ✅ (for rotation)   │
└──────────────────────────────────────┘
```
**Endpoint:** `GET/POST /api/auth/callback/google`
**Handled by:** NextAuth handlers (from lib/auth.ts)

```
Flow:
1. Receive authorization code from Google
2. Exchange code for tokens (access_token, refresh_token)
3. Store tokens in JWT
4. Call signIn callback (create/update profile)
5. Redirect to callback URL
```

### 6. Google Drive Connect
**Endpoint:** `GET /api/auth/google/callback`
**File:** `src/app/api/auth/google/callback/route.ts`

```
Query Params:
- code: authorization code from Google
- hostId: event ID or user ID

Flow:
1. Validate code and hostId
2. Exchange code for tokens at Google OAuth endpoint
3. Store tokens in google_tokens table
4. Create folder structure in Google Drive
5. Return success

Response:
{ success: true, folderId: "xxx" }
```

### 7. Check Drive Access
**Endpoint:** `POST /api/drive/check-access`
**File:** `src/app/api/drive/check-access/route.ts`

```
Flow:
1. Verify authentication
2. Check google_tokens table
3. Validate token expiry
4. Return connection status
```

### 8. RSVP Management
**Endpoints:**
- `POST /api/rsvps` - Submit RSVP
- `GET /api/rsvps?eventId=` - Get RSVPs

```
⚠️ SECURITY FIX #9: Rate Limited!
- Max 20 requests per minute per IP
- Returns 429 Too Many Requests if exceeded
```

### 9. Wishes
**Endpoints:**
- `POST /api/wishes` - Submit wish
- `GET /api/wishes?eventId=` - Get wishes

```
⚠️ SECURITY FIX #9: Rate Limited!
- Max 30 requests per minute per IP
- Returns 429 Too Many Requests if exceeded
```

### 10. Songs
**Endpoints:**
- `POST /api/songs` - Request song
- `GET /api/songs?eventId=` - Get songs

### 11. Payment
**Endpoints:**
- `POST /api/payment/create` - Create ToyyibPay payment
- `POST /api/payment/status` - Check payment status
- `POST /api/payment/webhook/toyyibpay` - Payment webhook

```
⚠️ SECURITY FIX #10 & #11: Payment Hardened!

/api/payment/create:
- Amount HARDCODED to RM159 (never trust client)
- ❌ NO amount parameter accepted
- ✅ PREMIUM_PRICE = 159 (server constant)

/api/payment/webhook/toyyibpay:
- Signature verification REQUIRED
- Rejects webhooks without valid signature (403)
- Uses SHA256 hash comparison
- Constant-time comparison (timing attack protection)
```

### 12. Media Upload
**Endpoint:** `POST /api/media`
**File:** `src/app/api/media/route.ts`

```
Flow:
1. Validate file type (image/audio/video)
2. Check file size limit
3. Upload to Supabase Storage or Google Drive
4. Return file URL
```

---

## 🔒 Security Summary

### Security Fixes Applied (2026-09-16)

| # | Issue | Severity | Status | Impact |
|---|-------|----------|--------|--------|
| 1 | GET/POST export pattern | 🟢 Low | ✅ FIXED | Export pattern correct |
| 2 | Session shape documented | 🟢 Low | ✅ FIXED | No tokens in session |
| 3 | signIn callback exists | 🟢 Low | ✅ FIXED | Profile creation works |
| 4 | Signout route needed | 🟢 Low | ✅ FIXED | NextAuth v5 compatible |
| 5 | Dual OAuth flows | 🟡 Medium | ✅ FIXED | Tokens server-side only |
| 6 | Token refresh logic | 🟡 Medium | ⚠️ TODO | Not yet implemented |
| 7 | Event claim vulnerability | 🔴 Critical | ✅ FIXED | claim_token required |
| 8 | Token exposure in JWT | 🔴 Critical | ✅ FIXED | accessToken removed |
| 9 | No rate limiting | 🟡 Medium | ✅ FIXED | 20-30 req/min per IP |
| 10 | Client payment amount | 🔴 Critical | ✅ FIXED | RM159 hardcoded |
| 11 | Webhook spoofing | 🔴 Critical | ✅ FIXED | Signature verified |

### Database Schema Updates

**New Columns Added:**
| Table | Column | Type | Purpose |
|-------|--------|------|---------|
| events | claim_token | TEXT | Ownership verification token |
| events | created_at | TIMESTAMPTZ | Event creation timestamp |

**New Indexes:**
| Table | Index | Purpose |
|-------|-------|---------|
| events | idx_events_slug_unique | Prevent duplicate slugs |
| events | idx_events_is_anonymous | Faster anonymous queries |
| events | idx_events_claim_token | Fast token verification |

**New Tables:**
| Table | Purpose |
|-------|---------|
| api_rate_limits | Advanced rate limiting (optional) |

### Migration File
**Path:** `supabase/migrations/003_security_enhancements.sql`

To apply:
1. Open Supabase Dashboard SQL Editor
2. Copy migration SQL
3. Run query

---

## 🎪 Event Portal (Public Page)

### Page: `/e/[eventSlug]`
**File:** `src/app/e/[eventSlug]/page.tsx`

#### Data Fetching Flow:
```
Page Load
    │
    ▼
┌──────────────────────────────┐
| Fetch event from Supabase    |
| WHERE slug = eventSlug       |
| AND is_active = true         |
└──────────┬───────────────────┘
           │
           ├─ Not found? → Show "Acara Tidak Dijumpai"
           │
           └─ Found?
                │
                ▼
┌──────────────────────────────┐
| Fetch event_modules          |
| WHERE event_id = eventId     |
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
| Build modulesMap             |
| { module_type: isEnabled }   |
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
| Render Event Portal          |
| Based on activeModule state  |
└──────────────────────────────┘
```

#### Module Navigation (LiquidGlassDock):
```
┌─────────────────────────────────────────────────────────────┐
│                    EVENT PORTAL DOCK                         │
├──────┬───────┬──────┬───────┬───────┬──────┬──────┬────────┤
│ 🏠  │ 👥    │ 🍽️  │ 📷    │ 🎤    │ 💌   │ 🎵   │ 🧧    │
│ Home │ RSVP  │ Menu │ Photo │ Audio │ Wish │ Song │ Angpao│
└──────┴───────┴──────┴───────┴───────┴──────┴──────┴──────┘
                              │
                      ┌───────┴───────┐
                      │   [+] FAB     │ ← Expand menu
                      └───────────────┘
```

#### Active Modules Display:
| Module | Component | Description |
|--------|-----------|-------------|
| Home | CountdownTimer | Event countdown, details, venue |
| RSVP | RSVPForm | Guest registration form |
| Photo Wall | PhotoUpload | Live photo upload & gallery |
| Audio Guestbook | AudioGuestbook | Voice messages |
| Wishes | WishForm | Text wishes/greetings |
| Angpao | Custom UI | Digital money transfer display |

---

## 💾 Database Schema

### Tables Relationship:
```
┌──────────────┐     ┌──────────────────┐
│   events     │◄────│  event_modules   │
├──────────────┤     ├──────────────────┤
│ id           │     │ id               │
│ slug         │     │ event_id (FK)    │
│ title        │     │ module_type      │
│ event_type   │     │ is_enabled       │
│ event_date   │     │ settings (JSONB) │
│ theme        │     └──────────────────┘
│ accent_color │
│ cover_image  │     ┌──────────────────┐
│ plan         │────►│    rsvps         │
│ is_anonymous │     ├──────────────────┤
│ host_id (FK) │     │ id               │
│ claim_token* │     │ event_id (FK)    │
│ created_at*  │     │ guest_name       │
└──────────────┘     │ phone_number     │
                     │ pax              │
                     │ qr_code_hash     │
                     └──────────────────┘

┌──────────────┐     ┌──────────────────┐
│  profiles    │────►│    wishes        │
├──────────────┤     ├──────────────────┤
│ id (PK)      │     │ id               │
│ email        │     │ event_id (FK)    │
│ full_name    │     │ guest_name       │
│ avatar_url   │     │ message          │
│ created_at   │     │ is_anonymous     │
└──────────────┘     └──────────────────┘

┌──────────────────┐     ┌──────────────────┐
│  google_tokens   │     │   payments       │
├──────────────────┤     ├──────────────────┤
│ id               │     │ id               │
│ host_id          │     │ user_name        │
│ access_token     │     │ user_email       │
│ refresh_token    │     │ amount           │
│ token_expiry     │     │ status           │
│ scope            │     │ toyyibpay_bill_code
└──────────────────┘     └──────────────────┘

* = NEW columns from security migration #003
```

### Key Fields:
- **events.plan**: `'free'` or `'premium'`
- **events.is_anonymous**: `true` until claimed by owner
- **events.claim_token**: UUID for ownership verification (*NEW*)
- **events.host_id**: FK to profiles after claiming (*NEW*)
- **events.created_at**: Timestamp of creation (*NEW*)
- **event_modules.settings**: JSONB for module-specific config
- **google_tokens.host_id**: Can be event_id or user_id
- **payments.amount**: Always RM159 (hardcoded, server-side)

---

## 💰 Freemium Model & Payments

### Free Plan:
```
✅ Basic event creation
✅ RSVP module
✅ Wishes module
✅ Photo wall (local storage)
✅ Basic themes
❌ Google Drive integration
❌ Custom domain
❌ Priority support
```

### Premium Plan (RM159 one-time):
```
✅ Everything in Free
✅ Google Drive integration
✅ Auto backup all uploads
✅ Audio guestbook storage
✅ Video backup
✅ Priority support
```

### Payment Flow (ToyyibPay) - SECURE
```
⚠️ SECURITY FIX #10 & #11 Applied!

User clicks "Upgrade to Premium"
         │
         ▼
┌──────────────────────┐
| POST /api/payment/create│
| - customerName ✅      │
| - email ✅             │
| ❌ NO amount param     │ ← FIXED! Hardcoded RM159
| ❌ NO eventSlug        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
| Server-side constant │
| PREMIUM_PRICE = 159  │ ← NEVER from client!
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
| ToyyibPay API        │
| Create checkout item │
| Amount: RM159 fixed  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
| Get payment URL      │
| Redirect user        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
| User completes pay   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
| Webhook callback     │
| POST /api/payment/...│
| webhook/toyyibpay    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
| ⚠️ VERIFY SIGNATURE! │ ← FIXED!
| SHA256 hash check    │
| Reject if invalid    │ (403 Forbidden)
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
| Update payment status│
| Upgrade event plan   │
└──────────────────────┘
```

### Payment Security Details

**Fix #10 - Amount Hardcoding:**
```typescript
// BEFORE (VULNERABLE)
const { amount } = body  // ⚠️ Attacker sends RM1
amount: amount || 159    // ⚠️ Paid RM1!

// AFTER (SECURE)
const PREMIUM_PRICE = 159  // ✅ Server constant
amount: PREMIUM_PRICE      // ✅ Always RM159
```

**Fix #11 - Signature Verification:**
```typescript
// BEFORE (VULNERABLE)
// TODO: Verify hash matches signature
// No actual verification!

// AFTER (SECURE)
const expectedHash = createHash('sha256')
  .update(`${billCode}${amount}${type}${paymentId}${referenceId}${SECRET}`)
  .digest('hex')

if (!signatureIsValid) {
  return NextResponse.json(
    { error: 'Invalid signature' },
    { status: 403 }
  )
}
```

---

## 📱 Component Hierarchy

### Global Layout:
```
App Layout (layout.tsx)
├── AuthProvider (NextAuth SessionProvider)
├── Toaster (notifications)
└── Children (page content)

Landing Page (app/(landing)/page.tsx)
├── Header (logo, nav)
├── Hero Section
├── Features Grid
├── Demo Events
└── Footer

Event Portal (app/e/[eventSlug]/page.tsx)
├── Header (event title, back button)
├── Theme-based Background
├── Main Content Area
│   ├── Conditional rendering based on activeModule
│   └── Dynamic styling from event.theme & accentColor
└── LiquidGlassDock (module navigation)
```

### Reusable Components:
```
components/ui/
├── GlassCard.tsx          - Glass morphism card wrapper
├── Header.tsx             - Standard header component
├── LiquidGlassDock.tsx    - Bottom dock navigation
├── LiquidFAB.tsx          - Floating action button
└── Toaster.tsx            - Toast notifications

components/widgets/
├── CountdownTimer.tsx     - Event countdown widget
├── GoogleDriveStatus.tsx  - Drive connection status
├── PaymentStatusWidget.tsx - Payment tracking
├── PhotoUpload.tsx        - Photo upload & gallery
├── WishForm.tsx           - Wish submission form
├── AudioGuestbook.tsx     - Voice message widget
└── GoogleDrivePaywall.tsx - Paywall for Drive feature

components/forms/
└── RSVPForm.tsx           - RSVP submission form

components/auth/
└── AuthProvider.tsx       - NextAuth provider wrapper
```

---

## 🔄 State Management Patterns

### Client Components:
```typescript
// Local state for form/data
const [formData, setFormData] = useState({...})
const [loading, setLoading] = useState(false)
const [activeModule, setActiveModule] = useState("home")

// Server data via useEffect
useEffect(() => {
  fetch('/api/endpoint')
    .then(r => r.json())
    .then(data => setData(data))
}, [])
```

### Session Management (SECURE):
```typescript
// Check session in components
const { data: session } = useSession()

// ⚠️ NO accessToken available!
// session.user.expiresAt ✅
// session.user.scope ✅
// session.user.accessToken ❌ (removed for security)

// Or manual fetch
const [user, setUser] = useState(null)
useEffect(() => {
  fetch('/api/auth/session')
    .then(r => r.json())
    .then(data => setUser(data?.session?.user || null))
}, [])
```

### Event Ownership Pattern:
```typescript
// After creating event, save claimToken!
const response = await fetch('/api/events/create', {
  method: 'POST',
  body: JSON.stringify(formData)
})
const result = await response.json()

// ⚠️ IMPORTANT: Save claimToken securely!
localStorage.setItem('claimToken', result.claimToken)
// or send to user via email

// When claiming event:
const claimResponse = await fetch('/api/events/claim', {
  method: 'POST',
  body: JSON.stringify({
    eventSlug: slug,
    claimToken: localStorage.getItem('claimToken')
  })
})
```

---

## 🚨 Error Handling

### Common Errors:
| Error | Cause | Solution |
|-------|-------|----------|
| Hydration mismatch | SSR/Client text diff | Use key props or suppress |
| 405 Method Not Allowed | Missing GET/POST handler | Export both from route.ts |
| redirect_uri_mismatch | Google Cloud Console config | Update authorized URIs |
| Module not found | Stale build cache | Clear .next folder |
| EADDRINUSE | Port already in use | Kill existing Node processes |
| **403 Token klaim tidak sah** | Wrong claim_token | Verify token matches create response |
| **429 Too Many Requests** | Rate limit exceeded | Wait 1 minute before retry |
| **403 Invalid signature** | Webhook spoofing attempt | Legitimate - ToyyibPay rejects |

### Security Error Responses:
```typescript
// 401 Unauthorized
return NextResponse.json(
  { error: 'Sila login terlebih dahulu' },
  { status: 401 }
)

// 403 Forbidden (Token/Signature invalid)
return NextResponse.json(
  { error: 'Token klaim tidak sah' },
  { status: 403 }
)

// 429 Too Many Requests (Rate limited)
return NextResponse.json(
  { error: 'Terlalu banyak permintaan. Tunggu sebentar.' },
  { status: 429 }
)
```

---

## 📝 Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://rnpevplarxkvyceqhsuh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>
SUPABASE_SERVICE_ROLE_KEY=<key>

# Google OAuth
GOOGLE_CLIENT_ID=<id>
GOOGLE_CLIENT_SECRET=<secret>
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<secret>

# ToyyibPay
TOYYIBPAY_SECRET_KEY=<key>
TOYYIBPAY_CATEGORY_CODE=<code>
TOYYIBPAY_BASE_URL=https://dev.toyyibpay.com/index.php/api
```

---

## 🎯 Future Enhancements

### Completed Tasks:
1. ✅ Fix NextAuth configuration
2. ✅ 6-step wizard complete
3. ✅ Live theme preview
4. ✅ Digital Angpao settings
5. ✅ **Security audit & fixes (2026-09-16)**
   - ✅ Token removal from JWT/session (#8)
   - ✅ Event claim token verification (#7)
   - ✅ Payment amount hardcoding (#10)
   - ✅ Webhook signature verification (#11)
   - ✅ Rate limiting on public endpoints (#9)
6. ⚠️ Real Google Drive OAuth flow (currently simulated)
7. ⚠️ Dynamic theme application on event portal
8. ⚠️ Display additional event data (description, dress code, social links)
9. ⚠️ Mobile responsive improvements
10. ⚠️ Admin dashboard analytics
11. ⚠️ QR code generation for events

### Pending Security Improvements:
1. ⚠️ Token refresh logic for Google tokens (#6)
2. ⚠️ Redis-based rate limiting (replace in-memory)
3. ⚠️ CSRF protection on forms
4. ⚠️ Content-Security-Policy headers
5. ⚠️ File upload validation (magic bytes checking)
6. ⚠️ Server-side SEO (generateMetadata for OG tags)

---

## 📊 File Structure Summary

```
src/
├── middleware.ts                 # Route protection
├── app/
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   ├── globals.css              # Tailwind + custom styles
│   ├── (dashboard)/
│   │   └── dashboard/
│   │       ├── page.tsx         # Dashboard home
│   │       └── create/page.tsx  # 6-step wizard
│   ├── (landing)/
│   │   └── page.tsx             # Landing page
│   ├── auth/
│   │   ├── signin/page.tsx      # Sign in page
│   │   └── error/page.tsx       # Auth error page
│   ├── e/
│   │   ├── [eventSlug]/page.tsx # Dynamic event portal
│   │   └── demo-*/page.tsx      # Demo event pages
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # NextAuth handlers
│   │   ├── events/create/route.ts       # Create event API
│   │   ├── events/claim/route.ts        # Claim event API
│   │   ├── rsvps/route.ts               # RSVP endpoints
│   │   ├── wishes/route.ts              # Wishes endpoints
│   │   ├── songs/route.ts               # Song requests
│   │   ├── payment/                     # Payment endpoints
│   │   ├── drive/                       # Drive endpoints
│   │   └── media/route.ts               # File upload
│   └── payment/
│       ├── checkout/page.tsx    # Payment page
│       └── success/page.tsx     # Success page
├── components/
│   ├── ui/                    # UI components
│   ├── widgets/               # Feature widgets
│   ├── forms/                 # Form components
│   └── auth/                  # Auth wrappers
├── lib/
│   ├── auth.ts                # NextAuth config
│   ├── supabase.ts            # Supabase client
│   ├── google-drive.ts        # Drive utilities
│   ├── toyyibpay.ts           # Payment utilities
│   └── utils.ts               # Helper functions
└── middleware.ts               # Route protection
```

---

## 🔐 Security Audit Summary (2026-09-16)

### Executive Summary
Comprehensive security audit completed with **11 issues identified** and **10 fixed**. The application is now significantly more secure against common attack vectors including token theft, event hijacking, payment manipulation, and API abuse.

### Critical Fixes Applied

#### 1. Token Exposure Prevention (#8) - 🔴 CRITICAL
**Risk:** accessToken/refreshToken exposed to browser → XSS attacks
**Fix:** Tokens NEVER stored in JWT/session, server-side only
**Files:** `src/lib/auth.ts`
**Impact:** ⭐⭐⭐⭐⭐ (Highest priority)

#### 2. Event Ownership Protection (#7) - 🔴 CRITICAL
**Risk:** Anyone can claim any anonymous event by knowing slug
**Fix:** UUID claim_token required, one-time use
**Files:** `src/app/api/events/create/route.ts`, `src/app/api/events/claim/route.ts`
**Impact:** ⭐⭐⭐⭐⭐ (Prevents event hijacking)

#### 3. Payment Amount Integrity (#10) - 🔴 CRITICAL
**Risk:** Attacker sends RM1 instead of RM159 for premium
**Fix:** Hardcoded PREMIUM_PRICE = 159, client amount ignored
**Files:** `src/app/api/payment/create/route.ts`
**Impact:** ⭐⭐⭐⭐⭐ (Revenue protection)

#### 4. Webhook Spoofing Prevention (#11) - 🔴 CRITICAL
**Risk:** Fake webhooks trigger payment success
**Fix:** SHA256 signature verification, constant-time comparison
**Files:** `src/app/api/payment/webhook/toyyibpay/route.ts`
**Impact:** ⭐⭐⭐⭐ (Fraud prevention)

#### 5. Rate Limiting (#9) - 🟡 MEDIUM
**Risk:** API flooding, spam, DoS attacks
**Fix:** In-memory rate limiter (20-30 req/min/IP)
**Files:** `src/app/api/wishes/route.ts`, `src/app/api/rsvps/route.ts`
**Impact:** ⭐⭐⭐ (Availability protection)

### Database Changes
```sql
-- New columns
ALTER TABLE events ADD COLUMN claim_token TEXT;
ALTER TABLE events ADD COLUMN created_at TIMESTAMPTZ;

-- New indexes
CREATE UNIQUE INDEX idx_events_slug_unique ON events(slug);
CREATE INDEX idx_events_is_anonymous ON events(is_anonymous);
CREATE INDEX idx_events_claim_token ON events(claim_token);

-- New table (optional advanced rate limiting)
CREATE TABLE api_rate_limits (...);
```

### Migration
**File:** `supabase/migrations/003_security_enhancements.sql`
**Status:** Ready to apply

---

**Last Updated:** 2026-09-16  
**Version:** 2.0.0 (Security Hardened)  
**Framework:** Next.js 16.3.5 (Turbopack)
