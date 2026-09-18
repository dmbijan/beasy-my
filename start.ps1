# ============================================
# Beasy.my - Build & Run Docker Container
# ============================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  BEASY.MY DOCKER DEPLOYMENT" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if Docker is running
Write-Host "[1/5] Checking Docker status..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✓ Docker installed: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker not found! Please install Docker Desktop first." -ForegroundColor Red
    Write-Host "Download from: https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
    exit 1
}

# Check if Docker daemon is running
Write-Host "[2/5] Checking Docker daemon..." -ForegroundColor Yellow
try {
    docker info > $null 2>&1
    Write-Host "✓ Docker daemon is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker daemon is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
    exit 1
}

# Stop existing container if running
Write-Host "[3/5] Stopping existing container (if any)..." -ForegroundColor Yellow
docker rm -f beasy-my 2>$null | Out-Null
Write-Host "✓ Old container removed" -ForegroundColor Green

# Build Docker image with environment variables
Write-Host "[4/5] Building Docker image..." -ForegroundColor Yellow
docker build -t beasy-my:latest `
  --build-arg NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL} `
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY} `
  --build-arg SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY} `
  --build-arg GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID} `
  --build-arg GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET} `
  --build-arg NEXTAUTH_SECRET=${NEXTAUTH_SECRET} `
  --build-arg TOYYIBPAY_SECRET_KEY=${TOYYIBPAY_SECRET_KEY} `
  --build-arg TOYYIBPAY_CATEGORY_CODE=${TOYYIBPAY_CATEGORY_CODE} `
  .
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Build completed successfully!" -ForegroundColor Green

# Run Docker container
Write-Host "[5/5] Starting Docker container..." -ForegroundColor Yellow
docker run -d `
  --name beasy-my `
  --restart unless-stopped `
  -p 3000:3000 `
  --env-file .env.docker `
  beasy-my:latest

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to start container!" -ForegroundColor Red
    exit 1
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  SUCCESS! Container is running!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan
Write-Host "Access your app at:" -ForegroundColor White
Write-Host "→ http://localhost:3000" -ForegroundColor Cyan
Write-Host "`nUseful commands:" -ForegroundColor Yellow
Write-Host "  View logs:        docker logs -f beasy-my" -ForegroundColor Gray
Write-Host "  Stop container:   docker stop beasy-my" -ForegroundColor Gray
Write-Host "  Start container:  docker start beasy-my" -ForegroundColor Gray
Write-Host "  Remove container: docker rm -f beasy-my" -ForegroundColor Gray
Write-Host "  Rebuild & restart: .\start.ps1" -ForegroundColor Gray
Write-Host "`n" -ForegroundColor White
