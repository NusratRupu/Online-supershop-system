# 🔧 XAMPP MySQL Auto-Fixer
# Run this script to automatically fix MySQL shutdown errors

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🔧 XAMPP MySQL AUTO-FIXER" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if running as admin
$isAdmin = [bool]([System.Security.Principal.WindowsIdentity]::GetCurrent().Groups -match "S-1-5-32-544")
if (-not $isAdmin) {
    Write-Host "❌ This script must be run as Administrator!`n" -ForegroundColor Red
    Write-Host "📝 Steps to run as Administrator:`n" -ForegroundColor Yellow
    Write-Host "   1. Right-click this file" -ForegroundColor Gray
    Write-Host "   2. Select 'Run with PowerShell'" -ForegroundColor Gray
    Write-Host "   3. When prompted, click 'Run'" -ForegroundColor Gray
    Read-Host "`nPress Enter to exit"
    exit
}

$mysqlDataPath = "C:\xampp\mysql\data"

# Verify XAMPP exists
if (-not (Test-Path "C:\xampp")) {
    Write-Host "❌ XAMPP not found at C:\xampp`n" -ForegroundColor Red
    Write-Host "💡 Please install XAMPP first: https://www.apachefriends.org/" -ForegroundColor Yellow
    Read-Host "`nPress Enter to exit"
    exit
}

Write-Host "[1/3] Closing XAMPP and MySQL..." -ForegroundColor Yellow
Write-Host "⚠️  Closing XAMPP if running..." -ForegroundColor Gray

# Stop XAMPP
Get-Process -Name "xampp-control" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process -Name "mysqld" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

Write-Host "✅ XAMPP stopped`n" -ForegroundColor Green

# Backup original data
$backupPath = "C:\xampp\mysql\data_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
if (Test-Path $mysqlDataPath) {
    Write-Host "[2/3] Backing up MySQL data..." -ForegroundColor Yellow
    Write-Host "📁 Backing up to: $backupPath" -ForegroundColor Gray
    
    try {
        Copy-Item -Path $mysqlDataPath -Destination $backupPath -Recurse -Force
        Write-Host "✅ Backup created successfully`n" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Could not create backup (may be in use)" -ForegroundColor Yellow
    }
}

# Delete corrupted files
Write-Host "[3/3] Removing corrupted MySQL files..." -ForegroundColor Yellow

$filesToDelete = @(
    "$mysqlDataPath\ibdata1",
    "$mysqlDataPath\ib_logfile0",
    "$mysqlDataPath\ib_logfile1"
)

$foldersToDelete = @(
    "$mysqlDataPath\mysql",
    "$mysqlDataPath\performance_schema"
)

# Delete individual files
foreach ($file in $filesToDelete) {
    if (Test-Path $file) {
        try {
            Remove-Item -Path $file -Force -ErrorAction Stop
            Write-Host "   ✅ Deleted: $(Split-Path $file -Leaf)" -ForegroundColor Green
        } catch {
            Write-Host "   ⚠️  Could not delete: $(Split-Path $file -Leaf) - $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
}

# Delete folders
foreach ($folder in $foldersToDelete) {
    if (Test-Path $folder) {
        try {
            Remove-Item -Path $folder -Recurse -Force -ErrorAction Stop
            Write-Host "   ✅ Deleted: $(Split-Path $folder -Leaf)" -ForegroundColor Green
        } catch {
            Write-Host "   ⚠️  Could not delete: $(Split-Path $folder -Leaf) - $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✅ CLEANUP COMPLETE!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "🚀 Next Steps:`n" -ForegroundColor Cyan

Write-Host "   1. Open XAMPP Control Panel" -ForegroundColor Yellow
Write-Host "   2. Click 'Start' next to MySQL" -ForegroundColor Yellow
Write-Host "   3. Wait for it to show as green ✅" -ForegroundColor Yellow
Write-Host "`n   If MySQL still crashes:" -ForegroundColor Yellow
Write-Host "   → Try changing port to 3307 (see XAMPP_MYSQL_FIX.md)" -ForegroundColor Gray
Write-Host "`n   To start your backend server:" -ForegroundColor Yellow
Write-Host "   → Run: START_SERVER.ps1" -ForegroundColor Gray

Write-Host "`n📁 Backup saved at: $backupPath`n" -ForegroundColor Gray

Read-Host "Press Enter to close this window"
