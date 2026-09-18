# 📋 Security Migration Checklist — Beasy.my

> **Tarikh Audit:** 2026-09-16  
> **Tahap Kritikal:** 🔴 Tinggi  
> **Status:** Semua kod betulkan ✅ | Migration DB perlu dijalankan ⏳

---

## ✅ Bahagian 1: Kod Sudah Diperbaiki

| # | Masalah | Status | Fail |
|---|---------|--------|------|
| 11 | ToyyibPay webhook HMAC palsu → verify via API call | ✅ SELESAI | `src/app/api/payment/webhook/toyyibpay/route.ts` |
| 🔴 | GET /api/rsvps terbuka umum (PDPA violation) | ✅ SELESAI | `src/app/api/rsvps/route.ts` |
| 🔴 | GET /api/songs terbuka umum | ✅ SELESAI | `src/app/api/songs/route.ts` |
| 🔴 | GET /api/media terbuka umum | ✅ SELESAI | `src/app/api/media/route.ts` |
| 🔴 | claim_token bocor ke browser via select(*) | ✅ SELESAI | `src/app/e/[eventSlug]/page.tsx` |
| 🔴 | Claim verification fail-open | ✅ SELESAI | `src/app/api/events/claim/route.ts` |
| 4 | Signout route bertindih NextAuth | ✅ SELESAI | `src/components/ui/Header.tsx` + deleted signout route |
| 🟡 | Rate limit in-memory tidak berfungsi | ✅ SELESAI | `supabase/migrations/004_security_enhancements.sql` |
| 🟡 | Slug blacklist reserved words | ✅ SELESAI | `src/app/api/events/create/route.ts` |
| 🟡 | Google tokens polymorphic host_id | ✅ SELESAI | `supabase/migrations/004_security_enhancements.sql` |
| 5/8 | Encrypt Google tokens at rest | ✅ SELESAI | `src/lib/google-drive.ts` |
| 🟡 | RSVP privacy consent (PDPA 2010) | ✅ SELESAI | `src/components/forms/RSVPForm.tsx`, `src/app/api/rsvps/route.ts` |
| 🟡 | NEXTAUTH_SECRET → AUTH_SECRET v5 | ✅ SELESAI | `src/lib/auth.ts`, `.env.local`, `.env.example` |

---

## ⏳ Bahagian 2: Perlu Dijalankan di Supabase Dashboard

### Langkah 1: Upload Migration Baru

1. Buka [Supabase Dashboard](https://supabase.com/dashboard/project/rnpevplarxkvyceqhsuh/sql/new)
2. Copy keseluruhan kandungan fail `supabase/migrations/004_security_enhancements.sql`
3. Paste ke SQL Editor
4. Klik **Run** (atau Ctrl+Enter)

### Langkah 2: Verifikasi Migration Berjaya

Selepas run, pastikan table berikut wujud:

```sql
-- Check rate limiting table
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'api_rate_limits';

-- Check claim_token_hash column
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'events' AND column_name = 'claim_token_hash';

-- Check google_tokens split columns
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'google_tokens' 
AND column_name IN ('user_id', 'event_id');

-- Check RSVP privacy columns
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'rsvps' 
AND column_name IN ('privacy_consent', 'consent_at');

-- Check unique constraint on payments
SELECT constraint_name FROM information_schema.table_constraints 
WHERE table_name = 'payments' AND constraint_type = 'UNIQUE';
```

### Langkah 3: Migrate Existing Google Tokens (PENTING!)

Existing tokens dalam DB masih plaintext. Untuk encrypt yang sedia ada:

```sql
-- ⚠️ JALANKAN SEKALI SAHAJA — encrypt semua existing tokens
-- Anda perlukan GOOGLE_TOKENS_ENCRYPTION_KEY dari .env.local

UPDATE google_tokens SET
  access_token = encode(
    pgp_sym_encrypt(access_token, '<GOOGLE_TOKENS_ENCRYPTION_KEY>'::text),
    'base64'
  ),
  refresh_token = encode(
    pgp_sym_encrypt(refresh_token, '<GOOGLE_TOKENS_ENCRYPTION_KEY>'::text),
    'base64'
  ),
  updated_at = NOW()
WHERE access_token IS NOT NULL;
```

**Atau** gunakan app-layer encryption (sudah ada dalam `google-drive.ts`) — ia akan auto-encrypt bila token di-refresh seterusnya.

### Langkah 4: Setup Cron untuk Auto-Cleanup RSVP

Supabase tidak ada built-in cron. Gunakan salah satu:

**Option A: Supabase Edge Function** (disyorkan)
```typescript
// Create edge function di: supabase/functions/cleanup-rsvps
// Schedule dengan Vercel Cron atau Railway
```

**Option B: External scheduler**
```bash
# Railway cron every Sunday 2AM UTC
# Call: POST https://rnpevplarxkvyceqhsuh.supabase.co/functions/v1/cleanup-rsvps
```

---

## ⚙️ Bahagian 3: Server/Deployment Configuration

### Environment Variables (WAJIB)

| Variable | Development | Production | Keterangan |
|----------|-------------|------------|------------|
| `AUTH_SECRET` | ✅ Ada | ✅ WAJIB | Jana: `openssl rand -base64 32` |
| `NEXTAUTH_SECRET` | ✅ Ada | ✅ Boleh buang | NextAuth v5 guna AUTH_SECRET |
| `TOYYIBPAY_BASE_URL` | `dev.toyyibpay.com` | `toyyibpay.com` | Tukar sebelum production |
| `GOOGLE_TOKENS_ENCRYPTION_KEY` | Dummy key | ✅ WAJIB real key | 32-byte hex: `openssl rand -hex 32` |
| `NEXT_PUBLIC_URL` | `http://localhost:3000` | `https://beasy.my` | Untuk callback URLs |

### Jana Encryption Key

```powershell
# PowerShell — jana 32-byte hex key
$bytes <- New-Object Byte[] 32
$rand <- New-Object System.Security.Cryptography.RNGCryptoServiceProvider
$rand.GetBytes($bytes)
[$bytes] -join '' | Out-File 'encryption-key.txt'
Get-Content encryption-key.txt
```

Salin output ke `.env.production` sebagai `GOOGLE_TOKENS_ENCRYPTION_KEY`.

---

## 🧪 Bahagian 4: Testing Checklist

### Test ToyyibPay Webhook
```bash
# Simulate webhook callback (tiada signature)
curl -X POST http://localhost:3000/api/payment/webhook/toyyibpay \
  -F "BillCode=TEST001" \
  -F "Amount=159" \
  -F "Remark=Successful"

# Expected: 200 OK (bukan 403)
# Check logs: should call getBillTransactions API
```

### Test Protected APIs
```bash
# Without auth — should return 401
curl http://localhost:3000/api/rsvps?eventId=<uuid>
# Expected: { "error": "Akses ditolak. Sila login..." }

# With session — should work if you're the host
# (Test via browser with logged-in session)
```

### Test Claim Token
```bash
# Create event → check response has claimToken
# Try claim without token — should return 403
# Try claim with wrong token — should return 403
# Try claim with correct token — should succeed
```

### Test RSVP Privacy Consent
1. Buka halaman event public
2. Cuba submit RSVP tanpa tick checkbox
3. Expected: validation error "Anda perlu bersetuju..."
4. Tick checkbox + submit → success
5. Check DB: `privacy_consent = true`, `consent_at` diisi

### Test Google Token Encryption
1. Login dengan Google OAuth
2. Upload file ke Drive
3. Check DB: `google_tokens.access_token` sepatutnya encrypted
4. Refresh page — Drive still works (auto-decrypt)

---

## 📊 Risiko Sebelum vs Selepas Fix

| Risiko | Sebelum | Selepas | Tahap Baru |
|--------|---------|---------|------------|
| Data peribadi bocor (RSVP/Songs/Media) | 🔴 Kritis | ✅ Rendah | ✓✓✓ |
| Payment fraud (fake callback) | 🔴 Kritis | ✅ Rendah | ✓✓✓ |
| Event dirampas (claim bypass) | 🔴 Kritis | ✅ Rendah | ✓✓✓ |
| Token DB dump → Drive akses | 🔴 Kritis | ✅ Rendah | ✓✓✓ |
| Public enumeration attacks | 🟡 Sederhana | ✅ Rendah | ✓✓ |
| Rate limit bypass | 🟡 Sederhana | ✅ Rendah | ✓✓ |
| Phishing pages on beasy.my | 🟡 Sederhana | 🟡 Monitor | ✓ |

---

## 📝 Nota Tambahan

### Yang Masih Perlu Dipertimbangkan

1. **CORS policies** — semak `middleware.ts` untuk routes yang mungkin terdedah
2. **Content Security Policy** — tambah CSP headers untuk elak XSS
3. **Manual moderation** — untuk angpao yang diaktifkan tanpa akaun berdaftar
4. **Storage limits** — had saiz upload per fail & kuota per event
5. **Magic bytes validation** — sahkan jenis fail sebenar (bukan sekadar extension)
6. **Report abuse button** — untuk community moderation
7. **`noindex` meta tag** — untuk events yang belum diklaim (elak SEO phishing)

### Dokumentasi Perlu Dikemaskini

- [ ] Diagram arkitektur — tukar "Server Memory" → "Database (encrypted)"
- [ ] Section numbering — sekarang lompat 4→6→6 → perlu 4→5→6
- [ ] Session shape docs — NextAuth pulangkan `{ user, expires }`, bukan `{ session: { user } }`
- [ ] Add PDPA policy page to `/privacy` route
