# Online Supershop - Server Launcher (PowerShell)
# Right-click and select "Run with PowerShell" to execute

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🚀 Online Supershop - Server Launcher" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Function to check if MySQL is running
function Test-MySQLConnection {
    try {
        $tcpConnection = Test-NetConnection -ComputerName 127.0.0.1 -Port 3306 -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
        return $tcpConnection.TcpTestSucceeded
    } catch {
        return $false
    }
}

# Check if MySQL is running
Write-Host "[1/3] Checking MySQL..." -ForegroundColor Yellow
if (Test-MySQLConnection) {
    Write-Host "✅ MySQL is already running!" -ForegroundColor Green
} else {
    Write-Host "❌ MySQL is not running. Attempting to start..." -ForegroundColor Red
    
    # Try to start MySQL services
    $mysqlServices = @("MySQL80", "MySQL57", "MySQL", "MariaDB", "MariaDB101")
    $started = $false
    
    foreach ($service in $mysqlServices) {
        if (Get-Service -Name $service -ErrorAction SilentlyContinue) {
            Write-Host "   Starting $service..." -ForegroundColor Yellow
            try {
                Start-Service -Name $service -ErrorAction SilentlyContinue
                Start-Sleep -Seconds 3
                
                if (Test-MySQLConnection) {
                    Write-Host "   ✅ $service started successfully!" -ForegroundColor Green
                    $started = $true
                    break
                }
            } catch {
                Write-Host "   ⚠️ Could not start $service" -ForegroundColor Yellow
            }
        }
    }
    
    if (-not $started) {
        Write-Host "`n❌ Could not start MySQL automatically!" -ForegroundColor Red
        Write-Host "`n💡 Please do ONE of the following:`n" -ForegroundColor Cyan
        Write-Host "   Option 1: Install XAMPP" -ForegroundColor Yellow
        Write-Host "            https://www.apachefriends.org/" -ForegroundColor Gray
        Write-Host "`n   Option 2: Install WAMP" -ForegroundColor Yellow
        Write-Host "            http://www.wampserver.com/" -ForegroundColor Gray
        Write-Host "`n   Option 3: Start MySQL from installed location" -ForegroundColor Yellow
        Write-Host "            Search 'MySQL Command Line Client' in Start Menu" -ForegroundColor Gray
        Write-Host "`n   Option 4: Find your MySQL service and start it manually" -ForegroundColor Yellow
        Write-Host "            Services > find MySQL > Right-click > Start" -ForegroundColor Gray
        
        Read-Host "`nPress Enter after you start MySQL, then run this script again"
        exit
    }
}

Write-Host "`n[2/3] Checking database connection..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

if (Test-MySQLConnection) {
    Write-Host "✅ MySQL connection successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Could not connect to MySQL" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit
}

# Start the backend server
Write-Host "`n[3/3] Starting backend server..." -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

$backendPath = Join-Path (Split-Path $PSScriptRoot) "backend"
Set-Location $backendPath

Write-Host "📁 Backend directory: $backendPath" -ForegroundColor Gray
Write-Host "🚀 Starting Node.js server...`n" -ForegroundColor Cyan

node server.js

# Keep window open if server crashes
Read-Host "`n❌ Server stopped. Press Enter to close this window"
