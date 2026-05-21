param([switch]$Admin)

# Check if running as admin
$isAdmin = [bool]([System.Security.Principal.WindowsIdentity]::GetCurrent().Groups -match "S-1-5-32-544")

if (-not $isAdmin) {
    Write-Host "Relaunching as Administrator..." -ForegroundColor Yellow
    Start-Process powershell "-ExecutionPolicy Bypass -File `"$PSCommandPath`" -Admin" -Verb RunAs
    exit
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "XAMPP MySQL AUTO-FIXER" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$mysqlDataPath = "C:\xampp\mysql\data"

# Verify XAMPP exists
if (-not (Test-Path "C:\xampp")) {
    Write-Host "XAMPP not found at C:\xampp`n" -ForegroundColor Red
    Write-Host "Please install XAMPP first: https://www.apachefriends.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit
}

Write-Host "[1/3] Closing XAMPP and MySQL..." -ForegroundColor Yellow

# Stop processes
Get-Process -Name "xampp-control" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process -Name "mysqld" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

Write-Host "Closed XAMPP`n" -ForegroundColor Green

# Backup data
$backupPath = "C:\xampp\mysql\data_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
if (Test-Path $mysqlDataPath) {
    Write-Host "[2/3] Backing up MySQL data..." -ForegroundColor Yellow
    try {
        Copy-Item -Path $mysqlDataPath -Destination $backupPath -Recurse -Force
        Write-Host "Backup created: $backupPath`n" -ForegroundColor Green
    } catch {
        Write-Host "Warning: Could not backup`n" -ForegroundColor Yellow
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

foreach ($file in $filesToDelete) {
    if (Test-Path $file) {
        try {
            Remove-Item -Path $file -Force -ErrorAction Stop
            Write-Host "   Deleted: $(Split-Path $file -Leaf)" -ForegroundColor Green
        } catch {
            Write-Host "   Error deleting $(Split-Path $file -Leaf): $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
}

foreach ($folder in $foldersToDelete) {
    if (Test-Path $folder) {
        try {
            Remove-Item -Path $folder -Recurse -Force -ErrorAction Stop
            Write-Host "   Deleted: $(Split-Path $folder -Leaf)" -ForegroundColor Green
        } catch {
            Write-Host "   Error deleting $(Split-Path $folder -Leaf): $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "CLEANUP COMPLETE!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Next Steps:`n" -ForegroundColor Cyan
Write-Host "   1. Open XAMPP Control Panel" -ForegroundColor Yellow
Write-Host "   2. Click 'Start' next to MySQL" -ForegroundColor Yellow
Write-Host "   3. Wait for it to show as green" -ForegroundColor Yellow
Write-Host "`n   4. Test your backend server:" -ForegroundColor Yellow
Write-Host "      cd backend" -ForegroundColor Gray
Write-Host "      node server.js" -ForegroundColor Gray

Write-Host "`n" -ForegroundColor Cyan

Read-Host "Press Enter to close this window"
