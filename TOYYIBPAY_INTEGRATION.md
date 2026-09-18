# ToyyibPay Integration Guide

## 🔑 API Credentials (Sudah Setup)
```env
TOYYIBPAY_SECRET_KEY=YOUR_TOYYIBPAY_SECRET_KEY
TOYYIBPAY_CATEGORY_CODE=rdhdemci
```

## 📡 Cara Webhook Berfungsi

### ❌ SALAH - Tak perlu setup di dashboard:
- Settings → Webhook → Add URL
- Settings → Callback Configuration

### ✅ BETUL - Set semasa create bill:

```typescript
const payload = {
  secret: TOYYIBPAY_SECRET,
  categoryCode: TOYYIBPAY_CATEGORY_CODE,
  billName: 'Beasy.my All-In-1',
  amount: '159',
  email: 'user@example.com',
  customerName: 'Ahmad',
  callbackUrl: 'https://beasy.my/api/payment/webhook/toyyibpay', // ← SET SINI
  returnUrl: 'https://beasy.my/payment/success',
}

fetch('https://dev.toyyibpay.com/index.php/api/createBill', {
  method: 'POST',
  body: JSON.stringify(payload),
})
```

## 🧪 Testing Locally

Gunakan ngrok untuk expose local server:

```bash
# Install ngrok
npm install -g ngrok

# Run ngrok
ngrok http 3000

# Copy HTTPS URL (contoh: https://abc123.ngrok.io)
# Update .env.local:
NEXT_PUBLIC_URL=https://abc123.ngrok.io
```

Kemudian test checkout flow.

## 🚀 Production Setup

1. Deploy ke Vercel:
```bash
vercel deploy --prod
```

2. Update `.env.production`:
```env
NEXT_PUBLIC_URL=https://beasy.my
TOYYIBPAY_BASE_URL=https://toyyibpay.com/index.php/api  # Production
```

3. Webhook akan auto work kerana domain publicly accessible.

## 📊 Test Mode vs Live Mode

| Environment | Base URL | Status |
|-------------|----------|--------|
| Development | `dev.toyyibpay.com` | Sandbox (test money) |
| Production | `toyyibpay.com` | Real money |

## 🔍 Verify Payment Manual

Jika webhook gagal, verify manual:

```bash
curl -X POST https://dev.toyyibpay.com/index.php/api/billStatus \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "YOUR_TOYYIBPAY_SECRET_KEY",
    "billCode": "YOUR_BILL_CODE"
  }'
```

## 📝 Webhook Payload (Dari ToyyibPay)

ToyyibPay hantar data sebagai **form-data** (bukan JSON):

```
BillCode: XXXX
Amount: 159.00
Type: FPX
PaymentId: 12345
ReferenceId: REF123
Description: Beasy.my All-In-1
Remark: Successful
Date: 2026-09-16 15:30:00
CardType: Visa
TrxGuid: unique-guid-here
```

## ⚠️ Common Issues

1. **Webhook 404** → Domain tak publicly accessible (guna ngrok atau deploy)
2. **Status tak update** → Check log webhook handler
3. **Signature mismatch** → Verify hash mengikut format ToyyibPay
