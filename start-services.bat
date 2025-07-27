@echo off
REM RentCart Microservices Startup Script for Windows
REM This script starts all backend services and the frontend

echo 🚀 Starting RentCart Microservices...

REM Create logs directory if it doesn't exist
if not exist "logs" mkdir logs

REM Kill any existing processes
echo 🧹 Cleaning up existing processes...
taskkill /f /im java.exe 2>nul
taskkill /f /im node.exe 2>nul

REM Wait a moment for processes to stop
timeout /t 3 /nobreak >nul

REM Start AuthService
echo 🔧 Starting AuthService on port 8081...
cd backend\AuthService
start "AuthService" cmd /c "mvn spring-boot:run > ..\..\logs\AuthService.log 2>&1"
cd ..\..

REM Start ItemService
echo 🔧 Starting ItemService on port 9091...
cd backend\ItemService
start "ItemService" cmd /c "mvn spring-boot:run > ..\..\logs\ItemService.log 2>&1"
cd ..\..

REM Start OrderService
echo 🔧 Starting OrderService on port 9092...
cd backend\OrderService
start "OrderService" cmd /c "mvn spring-boot:run > ..\..\logs\OrderService.log 2>&1"
cd ..\..

REM Start Review Service
echo 🔧 Starting ReviewService on port 9095...
cd backend\Review
start "ReviewService" cmd /c "mvn spring-boot:run > ..\..\logs\ReviewService.log 2>&1"
cd ..\..

REM Start Support Service
echo 🔧 Starting SupportService on port 9093...
cd backend\Support
start "SupportService" cmd /c "mvn spring-boot:run > ..\..\logs\SupportService.log 2>&1"
cd ..\..

REM Wait for services to start
echo ⏳ Waiting for services to start...
timeout /t 30 /nobreak >nul

REM Start Frontend
echo 🌐 Starting Frontend...
cd frontend

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    npm install
)

REM Start frontend
echo 🚀 Starting Next.js frontend...
start "Frontend" cmd /c "npm run dev > ..\logs\frontend.log 2>&1"
cd ..

echo.
echo 🎉 All services started successfully!
echo.
echo 📊 Service Status:
echo    AuthService:    http://localhost:8081
echo    ItemService:    http://localhost:9091
echo    OrderService:   http://localhost:9092
echo    ReviewService:  http://localhost:9095
echo    SupportService: http://localhost:9093
echo    Frontend:       http://localhost:3000
echo.
echo 📝 Logs are available in the logs\ directory
echo 🛑 To stop all services, close the command windows or run stop-services.bat
echo.
echo 💡 Services may take a few minutes to fully start up.
echo    Check the logs in the logs\ directory for more details.
echo.
pause 