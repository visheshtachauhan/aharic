# Download MongoDB installer
$mongoDbVersion = "7.0.5"
$downloadUrl = "https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.5-signed.msi"
$installerPath = "$env:TEMP\mongodb-installer.msi"

Write-Host "Downloading MongoDB $mongoDbVersion..."
Invoke-WebRequest -Uri $downloadUrl -OutFile $installerPath

# Install MongoDB
Write-Host "Installing MongoDB..."
Start-Process msiexec.exe -Wait -ArgumentList "/i `"$installerPath`" /quiet ADDLOCAL=ALL"

# Create data directory
$dataPath = "C:\data\db"
if (!(Test-Path -Path $dataPath)) {
    New-Item -ItemType Directory -Path $dataPath -Force
}

Write-Host "MongoDB installation completed!"
Write-Host "Data directory created at: $dataPath" 