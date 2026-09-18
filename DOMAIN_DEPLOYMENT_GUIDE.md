# ============================================
# BEASY.MY - DOMAIN DEPLOYMENT GUIDE
# Link Domain ke Docker Container
# ============================================

## 📋 PREREQUISITES

### Yang anda perlukan:
1. ✅ Domain (contoh: beasy.my) - beli di Namecheap/Cloudflare/Godaddy
2. ✅ VPS/Server (Hetzner, DigitalOcean, Contabo, AWS)
3. ✅ Docker installed pada server
4. ✅ DNS management access

---

## 🚀 OPTION 1: PRODUCTION VPS (RECOMMENDED)

### Step 1: Setup Server

**Recommended Providers:**
- **Hetzner** - RM150/bulan (AX41, 8GB RAM, 4 vCPU)
- **DigitalOcean** - $24/bulan (Droplet 4GB)
- **Contabo** - RM60/bulan (4GB RAM, unlimited bandwidth)
- **AWS EC2** - Free tier first year (t3.medium)

**Setup Ubuntu Server:**
```bash
# SSH ke server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Docker & Docker Compose
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

# Install Nginx (reverse proxy)
apt install nginx -y
```

### Step 2: Upload Project Files

```powershell
# Dari laptop, upload ke server
scp -r C:\Beasy.my\ root@your-server-ip:/root/beasy-my/

# Atau guna rsync (lebih cepat)
rsync -avz C:\Beasy.my\ root@your-server-ip:/root/beasy-my/
```

### Step 3: Configure Environment Variables

Edit `.env.docker` di server:
```bash
ssh root@your-server-ip
cd /root/beasy-my

nano .env.docker
```

**Update values untuk production:**
```env
NEXT_PUBLIC_URL=https://beasy.my
NEXTAUTH_URL=https://beasy.my
GOOGLE_REDIRECT_URI=https://beasy.my/api/auth/google/callback
TOYYIBPAY_CALLBACK_URL=https://beasy.my/api/payment/webhook/toyyibpay
```

### Step 4: Setup Nginx Reverse Proxy

Create Nginx config:
```bash
nano /etc/nginx/sites-available/beasy.my
```

Paste config:
```nginx
server {
    listen 80;
    server_name beasy.my www.beasy.my;

    # Redirect HTTP to HTTPS
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name beasy.my www.beasy.my;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/beasy.my/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/beasy.my/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Proxy settings
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        
        # Headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeouts
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        proxy_pass http://localhost:3000;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Logging
    access_log /var/log/nginx/beasy.access.log;
    error_log /var/log/nginx/beasy.error.log;
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/beasy.my /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Step 5: Setup SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d beasy.my -d www.beasy.my

# Auto-renewal test
certbot renew --dry-run
```

### Step 6: Setup Docker Container

Edit `docker-compose.yml`:
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL}
        NEXT_PUBLIC_SUPABASE_ANON_KEY: ${NEXT_PUBLIC_SUPABASE_ANON_KEY}
        SUPABASE_SERVICE_ROLE_KEY: ${SUPABASE_SERVICE_ROLE_KEY}
        GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
        GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET}
        NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
        TOYYIBPAY_SECRET_KEY: ${TOYYIBPAY_SECRET_KEY}
        TOYYIBPAY_CATEGORY_CODE: ${TOYYIBPAY_CATEGORY_CODE}
    container_name: beasy-my
    restart: unless-stopped
    ports:
      - "3000:3000"  # Only accessible via Nginx
    env_file:
      - .env.docker
    environment:
      - NEXT_PUBLIC_URL=https://beasy.my
      - NODE_ENV=production
    networks:
      - beasy-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

networks:
  beasy-network:
    driver: bridge
```

Run container:
```bash
cd /root/beasy-my
docker compose up -d --build
```

### Step 7: Configure DNS

Di DNS provider (Cloudflare/Namecheap/etc):

**A Record:**
```
Type    Name          Value           TTL
A       @             YOUR_SERVER_IP  Auto
A       www           YOUR_SERVER_IP  Auto
```

**Atau jika guna Cloudflare:**
```
Type    Name          Content         Proxied
A       @             YOUR_SERVER_IP  Orange (Proxied)
A       www           YOUR_SERVER_IP  Orange (Proxied)
```

---

## 🔧 OPTION 2: LOCAL NETWORK (Testing Sahaja)

Jika nak access dari network rumah/kantor yang sama:

### Step 1: Port Forwarding Router

1. Login router (`192.168.1.1` atau `192.168.0.1`)
2. Cari **Port Forwarding** / **Virtual Server**
3. Add rule:
   ```
   External Port: 3000
   Internal IP: [IP laptop anda]
   Internal Port: 3000
   Protocol: TCP
   ```

### Step 2: Get Public IP

```powershell
# Check public IP
curl ifconfig.me
```

### Step 3: Point Domain ke Public IP

Di DNS provider:
```
Type    Name    Value         TTL
A       @       YOUR_PUBLIC_IP  300
```

⚠️ **Warning:** 
- ISP mungkin block port 80/443 (residential connection)
- Public IP boleh berubah (guna DDNS jika perlu)
- Tidak recommended untuk production

---

## ☁️ OPTION 3: CLOUD PLATFORMS (EASIEST)

### Railway.app (FREE TIER)

1. Push code ke GitHub
2. Connect repo di Railway
3. Set environment variables
4. Auto-deploy dengan domain `project.railway.app`
5. Custom domain setting → Add domain

### Vercel (FREE TIER)

1. Push code ke GitHub
2. Import project di Vercel
3. Auto-deploy
4. Add custom domain di Settings

### Render.com (FREE TIER)

1. Create Web Service
2. Connect GitHub repo
3. Build command: `npm run build`
4. Start command: `node server.js`
5. Add custom domain

---

## 📊 COMPARISON

| Platform | Price | Bandwidth | Custom Domain | SSL |
|----------|-------|-----------|---------------|-----|
| **Hetzner VPS** | RM150/bln | Unlimited | ✅ Manual | ✅ Manual |
| **DigitalOcean** | RM100/bln | 5TB | ✅ Manual | ✅ Manual |
| **Railway** | Free $5 | 100GB | ✅ Easy | ✅ Auto |
| **Vercel** | Free tier | 100GB | ✅ Easy | ✅ Auto |
| **Render** | Free tier | 100GB | ✅ Easy | ✅ Auto |

---

## 🔐 SECURITY CHECKLIST

### Production Deployment:

- [ ] Change default passwords
- [ ] Setup firewall (UFW/iptables)
- [ ] Enable fail2ban
- [ ] Use SSH keys (bukan password)
- [ ] Disable root SSH login
- [ ] Setup SSL certificate
- [ ] Configure CORS headers
- [ ] Rate limiting
- [ ] Regular backups
- [ ] Monitor logs

### Firewall Setup:
```bash
# Enable UFW
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# Verify
ufw status
```

---

## 🔄 AUTOMATED DEPLOYMENT (CI/CD)

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy via SSH
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.VPS_HOST }}
        username: ${{ secrets.VPS_USER }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd /root/beasy-my
          docker compose down
          docker compose pull
          docker compose up -d --build
          docker image prune -f
```

---

## 📝 QUICK START PRODUCTION

```bash
# 1. SSH ke server
ssh root@your-vps-ip

# 2. Clone/pull project
cd /root/beasy-my

# 3. Update environment variables
nano .env.docker

# 4. Build & run
docker compose up -d --build

# 5. Setup Nginx (jika belum ada)
# Copy Nginx config dari guide di atas

# 6. Setup SSL
certbot --nginx -d beasy.my

# 7. Point DNS ke server IP

# Done! 🎉
```

---

## 🆘 TROUBLESHOOTING

### Container won't start:
```bash
# Check logs
docker logs beasy-my

# Check status
docker ps -a

# Restart
docker compose restart
```

### Nginx 502 Bad Gateway:
```bash
# Check if Next.js running
curl http://localhost:3000

# Check Nginx config
nginx -t

# Restart Nginx
systemctl restart nginx
```

### SSL not working:
```bash
# Check certificate
certbot certificates

# Renew certificate
certbot renew --force-renewal
```

### DNS not propagating:
```bash
# Check DNS propagation
dig beasy.my +short

# Or use online tool
# https://dnschecker.org/
```

---

## 💡 RECOMMENDATION

Untuk **production Beasy.my**, saya recommend:

1. **Start dengan Railway/Vercel** (free tier, easy setup)
2. **Migrate ke Hetzner VPS** bila dah ada users (cheaper long-term)
3. **Setup CI/CD** untuk auto-deploy

**Cost comparison:**
- Railway/Vercel free: RM0 (testing)
- Hetzner VPS: RM150/bulan (production)
- Total yearly: RM1,800 vs unlimited deployments

---

## 📞 NEED HELP?

Jika perlukan bantuan setup:
1. Pilih platform (VPS/Cloud)
2. Saya akan guide step-by-step
3. Test semua features
4. Go live! 🚀
