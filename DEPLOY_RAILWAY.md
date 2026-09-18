# ============================================
# BEASY.MY - RAILWAY DEPLOYMENT GUIDE
# Deploy ke Railway.app dalam 10 minit
# ============================================

## 📋 PREREQUISITES

### Yang anda perlukan:
1. ✅ GitHub account
2. ✅ Code dah push ke GitHub repository
3. ✅ Railway account (railway.app)

---

## 🚀 STEP-BY-STEP DEPLOYMENT

### Step 1: Push Code ke GitHub

```powershell
# Dari laptop, buka PowerShell
cd C:\Beasy.my

# Initialize git (jika belum ada)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Beasy.my ready for Railway"

# Create remote repository
# 1. Create new repo di github.com
# 2. Link repository
git remote add origin https://github.com/YOUR_USERNAME/beasy-my.git

# Push ke GitHub
git branch -M main
git push -u origin main
```

**Atau guna GitHub Desktop:**
1. Buka GitHub Desktop
2. File → Options → Accounts → Sign in to GitHub
3. Add repository dari local folder
4. Summary: "Initial commit"
5. Push to GitHub

---

### Step 2: Setup Railway Project

1. **Login ke Railway**
   - Buka https://railway.app
   - Click "Login"
   - Sign in dengan GitHub

2. **Create New Project**
   - Click "New Project"
   - Pilih "Deploy from GitHub repo"
   - Select repository: `beasy-my`
   - Click "Deploy Now"

3. **Wait for first build** (~2-3 minit)
   - Railway akan auto-detect Next.js
   - Install dependencies
   - Build project
   - Deploy

---

### Step 3: Configure Environment Variables

Selepas project created:

1. **Open Railway Dashboard**
   - Click pada project anda
   - Click tab **"Variables"**

2. **Add Environment Variables**

Copy values dari `.env.railway`:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://rnpevplarxkvyceqhsuh.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `YOUR_SUPABASE_ANON_KEY` |
| `SUPABASE_SERVICE_ROLE_KEY` | `YOUR_SUPABASE_SERVICE_ROLE_KEY` |
| `GOOGLE_CLIENT_ID` | `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | `YOUR_GOOGLE_CLIENT_SECRET` |
| `GOOGLE_REDIRECT_URI` | `https://YOUR_PROJECT_ID.up.railway.app/api/auth/google/callback` |
| `NEXTAUTH_URL` | `https://YOUR_PROJECT_ID.up.railway.app` |
| `NEXTAUTH_SECRET` | `YOUR_NEXTAUTH_SECRET` |
| `TOYYIBPAY_SECRET_KEY` | `YOUR_TOYYIBPAY_SECRET_KEY` |
| `TOYYIBPAY_CATEGORY_CODE` | `rdhdemci` |
| `TOYYIBPAY_BASE_URL` | `https://toyyibpay.com/index.php/api` |
| `TOYYIBPAY_CALLBACK_URL` | `https://YOUR_PROJECT_ID.up.railway.app/api/payment/webhook/toyyibpay` |

⚠️ **PENTING:** Gantikan `YOUR_PROJECT_ID` dengan actual ID!

**Cara dapat Project ID:**
- URL Railway: `https://railway.app/project/PROJECT_ID`
- Atau lihat di URL endpoint: `https://xxx-yyyzzz.up.railway.app`

---

### Step 4: Update Google OAuth Console

1. **Go to Google Cloud Console**
   - https://console.cloud.google.com/apis/credentials

2. **Update Authorized Redirect URIs**
   - Click pada Google OAuth credential
   - Under "Authorized redirect URIs", click "Add URI"
   - Add: `https://YOUR_PROJECT_ID.up.railway.app/api/auth/google/callback`
   - Save

---

### Step 5: Update ToyyibPay Callback URL

1. **Create Bill via API** (callback URL set programmatically)
   - Tidak perlu setup di dashboard
   - Callback URL dihantar setiap kali create bill

2. **Test webhook** selepas deploy

---

### Step 6: Redeploy

Selepas set semua variables:

1. **Go to Railway Dashboard**
2. Click **"Deployments"** tab
3. Click latest deployment
4. Click **"Redeploy"** (atau tunggu auto-redeploy)

Railway akan:
- Rebuild dengan new environment variables
- Restart application
- Update endpoint

---

### Step 7: Test Deployment

1. **Access your app**
   ```
   https://YOUR_PROJECT_ID.up.railway.app
   ```

2. **Test features:**
   - ✅ Landing page loads
   - ✅ Check console untuk errors
   - ✅ Try payment checkout flow
   - ✅ Test Google OAuth login

---

## 🌐 CUSTOM DOMAIN (Optional)

### Add Custom Domain (beasy.my)

1. **Go to Railway Dashboard**
2. Click **"Settings"** → **"Domains"**
3. Click **"Create Domain"**
4. Enter: `beasy.my` (atau `www.beasy.my`)
5. Railway akan give you **CNAME target**

Example:
```
CNAME: www → your-project.up.railway.app
```

6. **Update DNS di provider:**
   - Login ke domain registrar (Namecheap/Cloudflare)
   - Add CNAME record:
     ```
     Type: CNAME
     Name: www
     Value: your-project.up.railway.app
     TTL: Auto
     ```

7. **Wait for DNS propagation** (5 minit - 24 jam)

8. **Enable SSL**
   - Railway auto-provision SSL certificate
   - Status akan show "Active" bila ready

---

## 💰 COST ESTIMATION

### Railway Free Tier (Expired)
- **Free trial**: RM0 (14 hari, $5 credit)
- **After trial**: Pay as you go

### Estimated Costs

| Usage | Monthly Cost |
|-------|-------------|
| **Development/Testing** | RM0 - RM10 |
| **Low traffic (<1K visits)** | RM30 - RM50 |
| **Medium traffic (<10K visits)** | RM100 - RM200 |
| **High traffic (>10K visits)** | RM300+ |

**Billing model:**
- Compute: Based on RAM + CPU usage
- Bandwidth: RM0.10 per GB after 50GB free
- Storage: Not applicable (stateless)

💡 **Tip:** Use **Hetzner VPS** (RM150/bln fixed) jika traffic tinggi

---

## 🔧 TROUBLESHOOTING

### Build Failed

**Error: "Build failed"**
```bash
# Check build logs
# Go to Railway → Deployment → Click build → View logs

# Common issues:
1. Missing dependencies → Check package.json
2. TypeScript errors → Run npm run build locally first
3. Env vars missing → Check Variables tab
```

### Blank Page / White Screen

**Check browser console:**
```
F12 → Console tab
Look for errors related to:
- Supabase connection
- API routes failing
- Missing env vars
```

**Solution:**
```bash
# Test locally first
npm run dev

# Check if build succeeds
npm run build
```

### OAuth Not Working

**Check:**
1. ✅ Redirect URI correct: `https://PROJECT_ID.up.railway.app/api/auth/google/callback`
2. ✅ Google OAuth credentials active
3. ✅ NEXTAUTH_URL matches Railway domain
4. ✅ NEXTAUTH_SECRET is set

### Payment Webhook Not Received

**Check:**
1. ✅ ToyyibPay callback URL correct
2. ✅ API route accessible: `https://PROJECT_ID.up.railway.app/api/payment/webhook/toyyibpay`
3. ✅ Check Railway logs for webhook calls

---

## 🔄 AUTOMATIC DEPLOYMENT

Railway **auto-deploy** setiap kali code push ke GitHub:

```bash
# Push changes
git add .
git commit -m "Update feature X"
git push origin main

# Railway will:
# 1. Detect change
# 2. Build automatically
# 3. Deploy to production
```

**Preview deployments:**
- Setiap branch create preview URL
- Example: `https://branch-name-project.up.railway.app`

---

## 📊 MONITORING

### Railway Dashboard Features:

1. **Logs** (Real-time)
   - Click deployment → Logs tab
   - Filter by level (info, warn, error)

2. **Metrics**
   - CPU usage
   - Memory usage
   - Request count

3. **Environment Variables**
   - View & edit anytime
   - Auto-redeploy on change

---

## 📝 CHECKLIST SEBELUM GO LIVE

- [ ] All environment variables set
- [ ] Google OAuth redirect URI updated
- [ ] Database migration executed (Supabase)
- [ ] Test user registration works
- [ ] Test payment flow (test mode)
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Error pages customized
- [ ] Analytics installed (Google Analytics)
- [ ] Backup strategy in place

---

## 🎯 QUICK START COMMANDS

```powershell
# 1. Initialize Git
cd C:\Beasy.my
git init
git add .
git commit -m "Initial commit"

# 2. Create GitHub repo & push
# - Go to github.com/new
# - Create repository (no README)
# - Copy remote URL
git remote add origin https://github.com/YOUR_USERNAME/beasy-my.git
git branch -M main
git push -u origin main

# 3. Deploy to Railway
# - Go to railway.app
# - Connect GitHub repo
# - Auto-deploy!
```

---

## 💡 PRO TIPS

1. **Use Railway CLI** (advanced):
   ```bash
   npm install -g @railway/cli
   railway login
   railway up
   ```

2. **Set up health check:**
   - Railway auto-detects `/` endpoint
   - No manual config needed

3. **Use secrets for sensitive data:**
   - Store di Railway Secrets (encrypted)
   - Never commit `.env` files to Git

4. **Monitor costs:**
   - Set budget alerts di Railway
   - Monitor bandwidth usage

---

## 🆘 NEED HELP?

Common issues & solutions:

| Problem | Solution |
|---------|----------|
| Build fails | Run `npm run build` locally first |
| 502 Bad Gateway | Check if build succeeded, view logs |
| OAuth error | Verify redirect URI in Google Console |
| Supabase error | Check service role key is correct |
| Payment not working | Verify ToyyibPay credentials |

---

## 🚀 READY TO DEPLOY?

**Follow these steps:**

1. ✅ Push code ke GitHub
2. ✅ Connect Railway
3. ✅ Set environment variables
4. ✅ Update Google OAuth
5. ✅ Redeploy
6. ✅ Test everything
7. ✅ Add custom domain (optional)
8. ✅ GO LIVE! 🎉

**Estimated time: 10-15 minit**
