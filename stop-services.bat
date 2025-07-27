@echo off
REM RentCart Microservices Stop Script for Windows
REM This script stops all backend services and the frontend

echo 🛑 Stopping RentCart Microservices...

REM Kill all Java processes (Spring Boot services)
echo 🧹 Stopping all Spring Boot processes...
taskkill /f /im java.exe 2>nul

REM Kill all Node.js processes (Frontend)
echo 🧹 Stopping all Next.js processes...
taskkill /f /im node.exe 2>nul

REM Wait a moment for processes to stop
timeout /t 3 /nobreak >nul

REM Check if any processes are still running
echo 🔍 Checking for remaining processes...

REM Check for remaining Java processes
tasklist /fi "imagename eq java.exe" 2>nul | find "java.exe" >nul
if %errorlevel% equ 0 (
    echo ⚠️  Some Java processes are still running. Force killing...
    taskkill /f /im java.exe 2>nul
)

REM Check for remaining Node processes
tasklist /fi "imagename eq node.exe" 2>nul | find "node.exe" >nul
if %errorlevel% equ 0 (
    echo ⚠️  Some Node.js processes are still running. Force killing...
    taskkill /f /im node.exe 2>nul
)

REM Check ports using netstat
echo 🔍 Checking if ports are free...

REM Check each port
for %%p in (8081 9091 9092 9093 9095 3000) do (
    netstat -an | findstr ":%%p " | findstr "LISTENING" >nul
    if !errorlevel! equ 0 (
        echo ⚠️  Port %%p is still in use. You may need to manually stop the process.
        echo    Use: netstat -ano ^| findstr :%%p
    ) else (
        echo ✅ Port %%p is free
    )
)

echo.
echo 🎉 All services stopped successfully!
echo.
echo 📝 To start services again, run: start-services.bat
echo.
pause 