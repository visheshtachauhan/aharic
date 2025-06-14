# Kill any existing Node.js processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Start the Next.js development server with increased memory
$env:NODE_OPTIONS="--max-old-space-size=4096"
npx next dev -p 3001 