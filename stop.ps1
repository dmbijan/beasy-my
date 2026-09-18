# ============================================
# Beasy.my - Stop & Cleanup Docker Container
# ============================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  BEASY.MY DOCKER CLEANUP" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Stop container
Write-Host "[1/3] Stopping container..." -ForegroundColor Yellow
docker stop beasy-my 2>$null | Out-Null
Write-Host "✓ Container stopped" -ForegroundColor Green

# Remove container
Write-Host "[2/3] Removing container..." -ForegroundColor Yellow
docker rm beasy-my 2>$null | Out-Null
Write-Host "✓ Container removed" -ForegroundColor Green

# Optional: Remove image (uncomment if needed)
# Write-Host "[3/3] Removing image..." -ForegroundColor Yellow
# docker rmi beasy-my:latest 2>$null | Out-Null
# Write-Host "✓ Image removed" -ForegroundColor Green

Write-Host "`nCleanup completed!" -ForegroundColor Green
Write-Host "Run .\start.ps1 to rebuild and start fresh." -ForegroundColor Yellow
Write-Host "`n"
