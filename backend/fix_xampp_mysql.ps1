<#
Fix XAMPP MySQL port conflicts and optionally change MySQL port to a new one (default 3307).
Usage (run PowerShell as Administrator):
  .\fix_xampp_mysql.ps1            # dry-run, prints actions
  .\fix_xampp_mysql.ps1 -Apply    # perform edits and update backend/.env
  .\fix_xampp_mysql.ps1 -Apply -Force  # kill conflicting process if needed
#>
param(
    [switch]$Apply,
    [switch]$Force,
    [int]$NewPort = 3307
)

function Require-Admin {
    $current = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($current)
    if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
        Write-Error "This script must be run as Administrator. Right-click PowerShell and 'Run as administrator'."
        exit 1
    }
}

if ($Apply -or $Force) { Require-Admin }

Write-Host "== XAMPP MySQL Fix Script ==" -ForegroundColor Cyan
$actions = @()
if ($Apply) { $actions += 'Apply' } else { $actions += 'Dry-run' }
if ($Force) { $actions += 'Force' }
Write-Host "Action: $($actions -join ',')"
Write-Host "Target new port: $NewPort"

# 1) Check listeners on current port 3306
$portToCheck = 3306
$net = netstat -ano | Select-String ":$portToCheck\s"
if ($net) {
    $pids = $net -split "\r?\n" | ForEach-Object {
        ($_ -split '\s+')[-1]
    } | Select-Object -Unique
    Write-Host ("Found processes listening on port {0}: {1}" -f $portToCheck, ($pids -join ', ')) -ForegroundColor Yellow
    foreach ($pid in $pids) {
        try {
            $proc = Get-Process -Id $pid -ErrorAction Stop
            Write-Host (" - PID {0} -> {1}" -f $pid, $proc.ProcessName)
        } catch {
            Write-Host " - PID $pid -> process not found"
        }
    }
    if ($Force -and $Apply) {
        foreach ($pid in $pids) {
            try {
                Stop-Process -Id $pid -Force -ErrorAction Stop
                Write-Host "Killed process PID $pid" -ForegroundColor Green
            } catch {
                Write-Host ("Failed to kill PID {0}: {1}" -f $pid, $_) -ForegroundColor Red
            }
        }
    } else {
        Write-Host "If you want to force-stop these processes, re-run with -Apply -Force" -ForegroundColor Yellow
    }
} else {
    Write-Host "No listener on port $portToCheck detected." -ForegroundColor Green
}

# 2) Locate XAMPP my.ini files
$searchPaths = @('C:\xampp', 'D:\xampp', 'C:\Program Files\xampp', 'C:\Program Files (x86)\xampp')
$found = @()
foreach ($root in $searchPaths) {
    if (Test-Path $root) {
        $candidate = Join-Path $root 'mysql\bin\my.ini'
        if (Test-Path $candidate) { $found += $candidate }
        $candidate2 = Join-Path $root 'mysql\my.ini'
        if (Test-Path $candidate2) { $found += $candidate2 }
    }
}

# Also do a lightweight recursive search limited to depth 3 within drives C: and D:\ if nothing found
if (-not $found) {
    Write-Host "Doing a quick search for my.ini under C:\ and D:\ (this may take a few seconds)"
    try {
        $found += Get-ChildItem -Path C:\ -Filter my.ini -Recurse -ErrorAction SilentlyContinue -Depth 3 | Select-Object -ExpandProperty FullName
    } catch {}
    try {
        $found += Get-ChildItem -Path D:\ -Filter my.ini -Recurse -ErrorAction SilentlyContinue -Depth 3 | Select-Object -ExpandProperty FullName
    } catch {}
}

$found = $found | Select-Object -Unique
if (-not $found) {
    Write-Host "No my.ini found in common XAMPP locations. Please ensure XAMPP is installed or provide the path." -ForegroundColor Red
} else {
    Write-Host "Found my.ini files:" -ForegroundColor Cyan
    $found | ForEach-Object { Write-Host " - $_" }
}

# 3) For each config found, back up and replace port entries
foreach ($ini in $found) {
    Write-Host ""; Write-Host ("Processing {0}" -f $ini) -ForegroundColor Cyan
    $bak = "$ini.bak.$((Get-Date).ToString('yyyyMMddHHmmss'))"
    Write-Host (" Backup -> {0}" -f $bak)
    if ($Apply) {
        Copy-Item -Path $ini -Destination $bak -Force
    }

    $text = Get-Content $ini -Raw
    $newText = $text -replace 'port\s*=\s*3306', "port=$NewPort"
    if ($newText -ne $text) {
        Write-Host (" Will change 'port=3306' -> 'port={0}'" -f $NewPort) -ForegroundColor Yellow
        if ($Apply) {
            Set-Content -Path $ini -Value $newText -Encoding UTF8
            Write-Host " Updated $ini" -ForegroundColor Green
        }
    } else {
        Write-Host ' No "port=3306" occurrences found to change in this file.' -ForegroundColor Gray
    }
}

# 4) Update backend/.env DB_PORT if present
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$envPath = Join-Path $scriptDir '.env'
if (-not (Test-Path $envPath)) {
    # fallback to parent 'backend' folder if script placed elsewhere
    $envPath = Join-Path $scriptDir 'backend\.env'
}
if (Test-Path $envPath) {
    Write-Host ""; Write-Host ("Found .env at {0}" -f $envPath) -ForegroundColor Cyan
    $envText = Get-Content $envPath -Raw
    if ($envText -match 'DB_PORT\s*=') {
        Write-Host ' Current DB_PORT line detected.' -ForegroundColor Yellow
        $newEnvText = $envText -replace 'DB_PORT\s*=.*', "DB_PORT=$NewPort"
        if ($envText -ne $newEnvText) {
            Write-Host (" Will set DB_PORT={0} in .env" -f $NewPort)
            if ($Apply) {
                Copy-Item -Path $envPath -Destination "$envPath.bak.$((Get-Date).ToString('yyyyMMddHHmmss'))" -Force
                Set-Content -Path $envPath -Value $newEnvText -Encoding UTF8
                Write-Host (" Updated .env with DB_PORT={0}" -f $NewPort) -ForegroundColor Green
            }
        }
    } else {
        Write-Host ' No DB_PORT entry found — will append one.' -ForegroundColor Yellow
        if ($Apply) {
            Add-Content -Path $envPath -Value "`nDB_PORT=$NewPort"
            Write-Host (" Appended DB_PORT={0} to .env" -f $NewPort) -ForegroundColor Green
        }
    }
} else {
    Write-Host ("No .env found relative to script to update. Please update backend/.env manually to DB_PORT={0}" -f $NewPort) -ForegroundColor Yellow
}

Write-Host "`n== Done (dry-run or apply finished) ==" -ForegroundColor Cyan
Write-Host 'If you changed my.ini, start XAMPP Control Panel as Administrator and start MySQL.'
Write-Host 'If you still see errors, run: C:\xampp\mysql\bin\mysqld --console to view detailed messages.' -ForegroundColor Yellow

Write-Host 'Summary:' -ForegroundColor White
if ($found) { Write-Host (" - my.ini files updated: {0}" -f ($found -join ', ')) }
if (Test-Path $envPath) { Write-Host (" - .env updated at {0}" -f $envPath) }
if ($net) { Write-Host (" - Port {0} had listeners: {1}" -f $portToCheck, ($pids -join ', ')) }

Write-Host 'If you want me to update backend/.env here in the repo instead of running this script, tell me and I will change it for you.' -ForegroundColor Cyan
