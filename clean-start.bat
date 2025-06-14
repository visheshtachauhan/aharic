@echo off
echo Cleaning up Next.js application and restarting...

echo Killing any running Node.js processes...
taskkill /f /im node.exe >nul 2>&1

echo Checking for processes on common Next.js ports...
for %%p in (3000 3001 3002 3003 3004 3005 3006 3007 3008 3009) do (
  for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%%p ^| findstr LISTENING') do (
    echo Killing process on port %%p (PID: %%a)...
    taskkill /F /PID %%a >nul 2>&1
  )
)

echo Removing Next.js cache...
if exist .next (
  rmdir /s /q .next
  echo Next.js cache cleared.
) else (
  echo No Next.js cache found.
)

echo Setting up environment variables...
(
  echo NODE_ENV=development
  echo MONGODB_URI=mongodb://localhost:27017/food-delivery
  echo SMTP_HOST=smtp.example.com
  echo SMTP_PORT=587
  echo SMTP_USER=user@example.com
  echo SMTP_PASS=password123
  echo SMTP_FROM=noreply@example.com
  echo NEXTAUTH_URL=http://localhost:3000
  echo NEXTAUTH_SECRET=a_very_secret_key_for_development_only
  echo NEXT_PUBLIC_APP_URL=http://localhost:3000
  echo SUPPORT_EMAIL=support@example.com
) > .env.local.tmp

move /y .env.local.tmp .env.local
echo Environment variables updated.

echo Starting the development server...
npm run dev

echo If the server fails to start, try running this script again.
pause 