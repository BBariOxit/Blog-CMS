# Script tự động nén dự án (loại bỏ node_modules, dist, ...)
# Chạy script này để tạo file zip clean

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  Nén dự án Blog CMS" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$projectName = "Blog-CMS-Source"
$outputFile = "$projectName.zip"

# Xóa file zip cũ nếu có
if (Test-Path $outputFile) {
    Write-Host "[INFO] Xóa file nén cũ..." -ForegroundColor Yellow
    Remove-Item $outputFile -Force
}

# Danh sách thư mục/file cần loại trừ
$exclude = @(
    "node_modules",
    "dist",
    "build",
    ".git",
    ".vscode",
    ".idea",
    "*.log",
    ".env",
    "uploads",
    ".db_seeded",
    "*.zip",
    "*.rar",
    "*.7z",
    "coverage",
    "tmp",
    "temp"
)

Write-Host "[INFO] Đang nén dự án..." -ForegroundColor Yellow
Write-Host "[INFO] Loại trừ: node_modules, dist, .env, uploads..." -ForegroundColor Gray
Write-Host ""

# Lấy tất cả file, loại trừ những thư mục không cần
$files = Get-ChildItem -Path . -Recurse -File | Where-Object {
    $filePath = $_.FullName
    $shouldExclude = $false
    
    foreach ($pattern in $exclude) {
        if ($filePath -like "*\$pattern\*" -or $filePath -like "*\$pattern") {
            $shouldExclude = $true
            break
        }
    }
    
    -not $shouldExclude
}

# Tạo file zip
try {
    $files | Compress-Archive -DestinationPath $outputFile -CompressionLevel Optimal -Force
    
    $fileSize = (Get-Item $outputFile).Length / 1MB
    
    Write-Host "================================" -ForegroundColor Green
    Write-Host "  NÉN THÀNH CÔNG!" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "✅ File đã tạo: $outputFile" -ForegroundColor Green
    Write-Host "✅ Kích thước: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Green
    Write-Host ""
    Write-Host "💡 File đã sẵn sàng để nộp bài!" -ForegroundColor Cyan
    Write-Host ""
    
} catch {
    Write-Host "❌ LỖI: Không thể nén file!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Read-Host "Nhấn Enter để thoát"
