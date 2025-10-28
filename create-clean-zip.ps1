# Script tạo thư mục source sạch và nén (KHÔNG có node_modules)

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Tạo Source Code Sạch (Không node_modules)" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$sourceName = "Blog-CMS-Source-Clean"
$zipFile = "$sourceName.zip"

# Xóa thư mục và file cũ nếu có
if (Test-Path $sourceName) {
    Write-Host "[INFO] Xóa thư mục cũ..." -ForegroundColor Yellow
    Remove-Item $sourceName -Recurse -Force
}
if (Test-Path $zipFile) {
    Write-Host "[INFO] Xóa file zip cũ..." -ForegroundColor Yellow
    Remove-Item $zipFile -Force
}

# Tạo thư mục mới
Write-Host "[1/3] Tạo thư mục source..." -ForegroundColor Yellow
New-Item -Path $sourceName -ItemType Directory -Force | Out-Null

# Copy các file cần thiết
Write-Host "[2/3] Copy source code (bỏ qua node_modules)..." -ForegroundColor Yellow

# Server
Write-Host "  ✓ Copying server/src..." -ForegroundColor Gray
Copy-Item "server/src" "$sourceName/server/src" -Recurse -Force
Copy-Item "server/package.json" "$sourceName/server/" -Force
if (Test-Path "server/Dockerfile") {
    Copy-Item "server/Dockerfile" "$sourceName/server/" -Force
}
if (Test-Path "server/jest.config.json") {
    Copy-Item "server/jest.config.json" "$sourceName/server/" -Force
}
if (Test-Path "server/README.md") {
    Copy-Item "server/README.md" "$sourceName/server/" -Force
}

# Client
Write-Host "  ✓ Copying client/src..." -ForegroundColor Gray
Copy-Item "client/src" "$sourceName/client/src" -Recurse -Force
if (Test-Path "client/public") {
    Copy-Item "client/public" "$sourceName/client/public" -Recurse -Force
}
Copy-Item "client/index.html" "$sourceName/client/" -Force
Copy-Item "client/package.json" "$sourceName/client/" -Force
Copy-Item "client/vite.config.js" "$sourceName/client/" -Force
Copy-Item "client/tailwind.config.js" "$sourceName/client/" -Force
Copy-Item "client/postcss.config.js" "$sourceName/client/" -Force
if (Test-Path "client/README.md") {
    Copy-Item "client/README.md" "$sourceName/client/" -Force
}

# Database
if (Test-Path "Database") {
    Write-Host "  ✓ Copying Database..." -ForegroundColor Gray
    Copy-Item "Database" "$sourceName/Database" -Recurse -Force
}

# Root files
Write-Host "  ✓ Copying root files..." -ForegroundColor Gray
Copy-Item "README.md" "$sourceName/" -Force
Copy-Item "docker-compose.yml" "$sourceName/" -Force
Copy-Item "run.bat" "$sourceName/" -Force
Copy-Item "stop.bat" "$sourceName/" -Force
if (Test-Path ".gitignore") {
    Copy-Item ".gitignore" "$sourceName/" -Force
}
if (Test-Path "AUTH_SYSTEM.md") {
    Copy-Item "AUTH_SYSTEM.md" "$sourceName/" -Force
}
if (Test-Path "COVER_IMAGE_FEATURE.md") {
    Copy-Item "COVER_IMAGE_FEATURE.md" "$sourceName/" -Force
}
if (Test-Path "VIEW_FEATURE.md") {
    Copy-Item "VIEW_FEATURE.md" "$sourceName/" -Force
}

# Nén thư mục
Write-Host "[3/3] Nén source code..." -ForegroundColor Yellow
Compress-Archive -Path $sourceName -DestinationPath $zipFile -CompressionLevel Optimal -Force

# Tính kích thước
$zipSize = (Get-Item $zipFile).Length / 1MB

# Dọn dẹp thư mục tạm
Write-Host "[CLEANUP] Xóa thư mục tạm..." -ForegroundColor Yellow
Remove-Item $sourceName -Recurse -Force

# Thông báo kết quả
Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "  THÀNH CÔNG!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "✅ File đã tạo: $zipFile" -ForegroundColor Green
Write-Host "✅ Kích thước: $([math]::Round($zipSize, 2)) MB" -ForegroundColor Green
Write-Host ""

if ($zipSize -lt 10) {
    Write-Host "🎉 File đủ nhẹ để nộp bài! (< 10MB)" -ForegroundColor Green
} else {
    Write-Host "⚠️  File vẫn hơi nặng ($([math]::Round($zipSize, 2)) MB)" -ForegroundColor Yellow
    Write-Host "💡 Kiểm tra lại có thư mục nào không cần thiết không." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Nội dung file zip:" -ForegroundColor Cyan
Write-Host "  ✓ server/src/        (source code)" -ForegroundColor Gray
Write-Host "  ✓ client/src/        (source code)" -ForegroundColor Gray
Write-Host "  ✓ Database/          (schema + docs)" -ForegroundColor Gray
Write-Host "  ✓ README.md          (documentation)" -ForegroundColor Gray
Write-Host "  ✓ run.bat, stop.bat  (scripts)" -ForegroundColor Gray
Write-Host ""
Write-Host "❌ KHÔNG chứa:" -ForegroundColor Red
Write-Host "  ✗ node_modules/      (đã loại bỏ)" -ForegroundColor Gray
Write-Host "  ✗ .git/              (đã loại bỏ)" -ForegroundColor Gray
Write-Host "  ✗ .env               (đã loại bỏ)" -ForegroundColor Gray
Write-Host ""

Read-Host "Nhấn Enter để thoát"
