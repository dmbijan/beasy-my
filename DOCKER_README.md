# 🐳 Beasy.my - Docker Deployment Guide

## 📋 Prerequisites

1. **Docker Desktop** installed on Windows
   - Download: https://www.docker.com/products/docker-desktop/
   - Install dan restart laptop selepas install

2. **Environment Variables** configured
   - Copy `.env.docker` ke `.env.local`
   - Fill in Supabase credentials

---

## 🚀 Quick Start

### Step 1: Setup Environment Variables

Edit file `.env.docker` dengan credentials anda:

```env
# Supabase (dari Dashboard → Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google OAuth (sudah diisi)
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET

# NextAuth (sudah diisi)
NEXTAUTH_SECRET=YOUR_NEXTAUTH_SECRET

# ToyyibPay (sudah diisi)
TOYYIBPAY_SECRET_KEY=YOUR_TOYYIBPAY_SECRET_KEY
TOYYIBPAY_CATEGORY_CODE=rdhdemci
```

### Step 2: Build & Run

Buka PowerShell di folder `C:\Beasy.my` dan run:

```powershell
.\start.ps1
```

Atau manual command:

```powershell
# Build image
docker build -t beasy-my:latest .

# Run container
docker run -d --name beasy-my --restart unless-stopped -p 3000:3000 --env-file .env.docker beasy-my:latest
```

### Step 3: Access App

Buka browser dan navigate ke:
```
http://localhost:3000
```

---

## 📁 Project Structure

```
C:\Beasy.my\
├── Dockerfile              # Docker build configuration
├── docker-compose.yml      # Docker Compose setup
├── .env.docker             # Environment variables template
├── .env.local              # Your actual credentials
├── .dockerignore           # Files to exclude from build
├── start.ps1               # Build & run script
├── stop.ps1                # Stop & cleanup script
└── ...
```

---

## 🔧 Useful Commands

### Build & Run
```powershell
.\start.ps1                              # Auto build & run
docker-compose up -d --build             # Using compose
```

### View Logs
```powershell
docker logs -f beasy-my                  # Live logs
docker logs beasy-my                     # Last logs
```

### Stop Container
```powershell
.\stop.ps1                               # Auto cleanup
docker stop beasy-my                     # Stop only
docker rm beasy-my                       # Remove only
docker rm -f beasy-my                    # Force remove
```

### Restart Container
```powershell
docker restart beasy-my                  # Restart
docker start beasy-my                    # Start stopped
```

### Check Status
```powershell
docker ps                                # Running containers
docker ps -a                             # All containers
docker images                            # Images
docker inspect beasy-my                  # Container details
```

### Update App
```powershell
# After code changes:
.\stop.ps1                               # Stop old
.\start.ps1                              # Build & run new
```

---

## 🛠️ Troubleshooting

### Issue: "Docker daemon not running"
**Solution:** 
1. Buka Docker Desktop
2. Tunggu sampai status "Docker Desktop is running"
3. Try again

### Issue: "Port 3000 already in use"
**Solution:**
```powershell
# Kill process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port in docker-compose.yml
# - "3001:3000"
```

### Issue: "Build failed"
**Solution:**
```powershell
# Clean and rebuild
.\stop.ps1
docker system prune -a                 # Clean unused images
.\start.ps1                            # Rebuild
```

### Issue: "Container exits immediately"
**Solution:**
```powershell
# Check logs for errors
docker logs beasy-my

# Common fixes:
# 1. Check .env.docker has all required variables
# 2. Verify NEXTAUTH_SECRET is set
# 3. Check Supabase credentials are valid
```

### Issue: "Permission denied"
**Solution:**
Run PowerShell as Administrator or check Docker settings:
1. Docker Desktop → Settings → Resources → File sharing
2. Add `C:\Beasy.my` to shared folders

---

## 🌐 Production Deployment

Untuk deploy ke production server:

### Option 1: VPS + Docker
```bash
# Upload project ke server
scp -r C:\Beasy.my user@server:/opt/beasy-my

# SSH ke server
ssh user@server
cd /opt/beasy-my

# Build & run
sudo docker build -t beasy-my .
sudo docker run -d --name beasy-my -p 3000:3000 --env-file .env.production beasy-my
```

### Option 2: Docker Registry
```bash
# Tag image
docker tag beasy-my:latest registry.example.com/beasy-my:latest

# Push to registry
docker push registry.example.com/beasy-my:latest

# Pull & run on server
docker pull registry.example.com/beasy-my:latest
docker run -d --name beasy-my -p 3000:3000 beasy-my:latest
```

---

## 💡 Tips

1. **Always use `.env.docker`** untuk development
2. **Create `.env.production`** untuk production dengan values berbeza
3. **Use docker-compose** untuk manage multiple services
4. **Enable healthcheck** untuk auto-restart jika crash
5. **Monitor logs** regularly dengan `docker logs -f`

---

## 📊 Docker Resources

- [Docker Documentation](https://docs.docker.com/)
- [Next.js Docker Guide](https://nextjs.org/docs/deployment#manual-deployment)
- [Docker Hub](https://hub.docker.com/)

---

## ✅ Checklist Before Deploying

- [ ] Docker Desktop installed & running
- [ ] `.env.docker` filled with correct credentials
- [ ] Database migration executed in Supabase
- [ ] Google OAuth consent screen configured
- [ ] ToyyibPay account created & API keys ready
- [ ] Test locally at http://localhost:3000
- [ ] All features working (OAuth, Payment, etc.)
