@echo off
setlocal
where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo npm was not found. Install Node.js, then try again.
  pause
  exit /b 1
)
if not exist node_modules\vite\bin\vite.js (
  echo Installing project dependencies...
  call npm.cmd install
  if errorlevel 1 (
    pause
    exit /b 1
  )
)
call npm.cmd run dev
pause
