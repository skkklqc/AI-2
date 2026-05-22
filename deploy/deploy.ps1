$ErrorActionPreference = "Stop"

$ServerIp = "1.117.70.56"
$ServerUser = if ($env:DEPLOY_USER) { $env:DEPLOY_USER } else { "ubuntu" }
$RemoteDir = "/home/ubuntu/salary-calculator"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$Archive = Join-Path $env:TEMP "salary-calculator-deploy.tar.gz"

Write-Host "==> Packaging project..."
if (Test-Path $Archive) { Remove-Item $Archive -Force }

Push-Location $ProjectRoot
tar --exclude=node_modules --exclude=frontend/dist --exclude=.git -czf $Archive .
Pop-Location

Write-Host "==> Uploading to ${ServerUser}@${ServerIp}..."
Write-Host "    (Enter SSH password when prompted)"
ssh "${ServerUser}@${ServerIp}" "mkdir -p $RemoteDir"
scp $Archive "${ServerUser}@${ServerIp}:/tmp/salary-calculator-deploy.tar.gz"

Write-Host "==> Running remote setup..."
ssh "${ServerUser}@${ServerIp}" @"
set -e
mkdir -p $RemoteDir
tar -xzf /tmp/salary-calculator-deploy.tar.gz -C $RemoteDir
chmod +x $RemoteDir/deploy/server-setup.sh
bash $RemoteDir/deploy/server-setup.sh
"@

Write-Host ""
Write-Host "Done! Open http://${ServerIp}:3001"
