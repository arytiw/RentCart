@echo off
REM RentCart Service Status Checker

echo 🚀 Checking RentCart Services Status...
echo.

REM Check if Java processes are running
echo 📋 Checking Java processes...
tasklist /fi "imagename eq java.exe" 2>nul | find "java.exe" >nul
if %errorlevel% equ 0 (
    echo ✅ Java processes are running
    tasklist /fi "imagename eq java.exe" /fo table
) else (
    echo ❌ No Java processes found
)

echo.

REM Check if Node processes are running
echo 📋 Checking Node processes...
tasklist /fi "imagename eq node.exe" 2>nul | find "node.exe" >nul
if %errorlevel% equ 0 (
    echo ✅ Node processes are running
    tasklist /fi "imagename eq node.exe" /fo table
) else (
    echo ❌ No Node processes found
)

echo.

REM Check specific ports
echo 🔌 Checking service ports...

REM Check AuthService (port 8081)
netstat -ano | findstr :8081 >nul
if %errorlevel% equ 0 (
    echo ✅ AuthService is running on port 8081
) else (
    echo ❌ AuthService is NOT running on port 8081
)

REM Check ItemService (port 9091)
netstat -ano | findstr :9091 >nul
if %errorlevel% equ 0 (
    echo ✅ ItemService is running on port 9091
) else (
    echo ❌ ItemService is NOT running on port 9091
)

REM Check Frontend (port 3000)
netstat -ano | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo ✅ Frontend is running on port 3000
) else (
    echo ❌ Frontend is NOT running on port 3000
)

echo.

REM Test ItemService endpoint
echo 🧪 Testing ItemService endpoint...
curl -s http://localhost:9091/items >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ ItemService endpoint is responding
) else (
    echo ❌ ItemService endpoint is NOT responding
)

echo.

echo 📊 Summary:
echo - If you see ❌ for ItemService, run: start-rent-services.bat
echo - If you see ❌ for Frontend, run: cd frontend && npm run dev
echo - Visit http://localhost:3000/test-connection to test connections
echo - Visit http://localhost:3000/items-client to test client-side rendering

pause 