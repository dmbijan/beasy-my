# 🐳 Deploy Beasy.my dengan Docker + VPS

## 💰 Cost Comparison

| Provider | Price | Bandwidth | Best For |
|----------|-------|-----------|----------|
| **DigitalOcean** | $6/mo | 2TB | Small-Medium apps |
| **Hetzner** | €4/mo (~$10) | 20TB | Best value |
| **Linode/Akamai** | $5/mo | 1TB | Reliable |
| **Contabo** | €4/mo (~$10) | Unlimited | Budget option |
| **AWS EC2** | $0 first year | Pay per use | Free tier |

---

## 📋 Prerequisites

### 1. Server Setup
```bash
# Minimum specs:
- 1 GB RAM (2 GB recommended)
- 1 vCPU
- 25 GB SSD
- Ubuntu 22.04 LTS
```

### 2. Install Docker & Docker Compose
```bash
# SSH ke server
ssh root@your-server-ip

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo systemctl enable docker
sudo systemctl start docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify
docker --version
docker-compose --version
```

---

## 🏗️ Step 1: Create Dockerfile

```dockerfile
# c:\Beasy.my\Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Check package.json for dependency architecture
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build step
RUN npm run build

# Production image, copy all files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

---

## 🏗️ Step 2: Create docker-compose.yml

```yaml
# c:\Beasy.my\docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: beasy-my
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - TOYYIBPAY_SECRET_KEY=${TOYYIBPAY_SECRET_KEY}
      - TOYYIBPAY_CATEGORY_CODE=${TOYYIBPAY_CATEGORY_CODE}
      - TOYYIBPAY_BASE_URL=${TOYYIBPAY_BASE_URL}
    networks:
      - beasy-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  beasy-network:
    driver: bridge
```

---

## 🏗️ Step 3: Create .env file (Server)

```env
# c:\Beasy.my\.env.server
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET

NEXTAUTH_URL=https://beasy.my
NEXTAUTH_SECRET=YOUR_NEXTAUTH_SECRET

TOYYIBPAY_SECRET_KEY=YOUR_TOYYIBPAY_SECRET_KEY
TOYYIBPAY_CATEGORY_CODE=rdhdemci
TOYYIBPAY_BASE_URL=https://dev.toyyibpay.com/index.php/api
```

---

## 🏗️ Step 4: Update next.config.js

```javascript
// c:\Beasy.my\next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Important for Docker deployment
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  pwa: {
    dest: 'public',
    register: true,
    sw: true,
  },
}

module.exports = nextConfig
```

---

## 🚀 Step 5: Deploy to Server

### Upload code ke server:

```bash
# Local machine - compress project
tar -czf beasy-my.tar.gz beasy.my/

# Upload to server
scp beasy-my.tar.gz root@your-server-ip:/opt/beasy-my.tar.gz

# SSH ke server
ssh root@your-server-ip
cd /opt

# Extract
tar -xzf beasy-my.tar.gz
cd beasy.my
```

### Build dan run:

```bash
# Copy env file
cp .env.server .env

# Build dan start
docker-compose up -d --build

# Check logs
docker-compose logs -f

# Check status
docker-compose ps
```

---

## 🌐 Step 6: Setup Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt update && sudo apt install nginx -y

# Create nginx config
sudo nano /etc/nginx/sites-available/beasy.my
```

```nginx
# /etc/nginx/sites-available/beasy.my
server {
    listen 80;
    server_name beasy.my www.beasy.my;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Port $server_port;
        
        # WebSocket support
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
    }

    # Cache static assets
    location /_next/static {
        proxy_pass http://localhost:3000;
        expires 365d;
        access_log off;
    }

    location /static {
        proxy_pass http://localhost:3000;
        expires 30d;
        access_log off;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/beasy.my /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d beasy.my -d www.beasy.my
```

---

## 🔧 Step 7: Setup Systemd Service (Optional)

Jika tak nak guna Docker Compose:

```bash
sudo nano /etc/systemd/system/beasy.service
```

```ini
[Unit]
Description=Beasy.my Next.js App
After=network.target

[Service]
Type=simple
User=nextjs
WorkingDirectory=/var/www/beasy-my
ExecStart=/usr/bin/npm start
Restart=always
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable beasy
sudo systemctl start beasy
sudo systemctl status beasy
```

---

## 📊 Monitoring & Maintenance

### Check logs:
```bash
# Docker logs
docker-compose logs -f

# Or systemd
journalctl -u beasy -f
```

### Restart service:
```bash
docker-compose restart
# or
sudo systemctl restart beasy
```

### Update app:
```bash
cd /var/www/beasy-my
git pull
docker-compose up -d --build
```

### Backup database:
```bash
# Supabase backup (manual dari dashboard)
# Or PostgreSQL dump
pg_dump -h host -U user -d dbname > backup.sql
```

---

## 💰 Total Monthly Cost

| Item | Cost |
|------|------|
| VPS (DigitalOcean/Hetzner) | $5-10 |
| Domain (.my domain) | $1-2 |
| Supabase (Free tier) | $0 |
| **Total** | **$6-12/month** |

vs Vercel: **$0-20/month** (but more features included)

---

## ✅ Pros & Cons

### Docker + VPS:
**Pros:**
- ✅ Full control over server
- ✅ Cheapest long-term option
- ✅ No vendor lock-in
- ✅ Can run multiple apps
- ✅ Webhook works perfectly

**Cons:**
- ❌ Need DevOps knowledge
- ❌ Manual security updates
- ❌ Manual SSL renewal
- ❌ No auto-scaling
- ❌ Need to manage backups

### Vercel:
**Pros:**
- ✅ Zero configuration
- ✅ Auto SSL & CDN
- ✅ Auto-scaling
- ✅ Built-in analytics
- ✅ Easy deployment

**Cons:**
- ❌ Vendor lock-in
- ❌ More expensive at scale
- ❌ Limited control

---

## 🎯 Recommendation

| Scenario | Best Option |
|----------|-------------|
| **Startup/MVP** | Vercel (free tier) |
| **Production on budget** | Docker + Hetzner ($4/mo) |
| **Enterprise** | Vercel + AWS |
| **Learning purpose** | Docker + DigitalOcean ($6/mo) |

Untuk Beasy.my, saya recommend:
1. **Start dengan Vercel free tier** (RM0/bulan)
2. **Migrate ke Docker + VPS** bila dah ada revenue
