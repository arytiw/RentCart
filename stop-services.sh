#!/bin/bash

# RentCart Microservices Stop Script
# This script stops all backend services and the frontend

echo "🛑 Stopping RentCart Microservices..."

# Function to stop service by PID file
stop_service_by_pid() {
    local service_name=$1
    local pid_file="logs/${service_name}.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            echo "🛑 Stopping $service_name (PID: $pid)..."
            kill -TERM $pid
            sleep 2
            if ps -p $pid > /dev/null 2>&1; then
                echo "🔨 Force killing $service_name..."
                kill -KILL $pid
            fi
            echo "✅ $service_name stopped"
        else
            echo "ℹ️  $service_name is not running"
        fi
        rm -f "$pid_file"
    else
        echo "ℹ️  No PID file found for $service_name"
    fi
}

# Kill all Spring Boot processes
echo "🧹 Stopping all Spring Boot processes..."
pkill -f "spring-boot:run" 2>/dev/null || true

# Kill all Next.js processes
echo "🧹 Stopping all Next.js processes..."
pkill -f "next dev" 2>/dev/null || true

# Stop services by PID files
stop_service_by_pid "AuthService"
stop_service_by_pid "ItemService"
stop_service_by_pid "OrderService"
stop_service_by_pid "ReviewService"
stop_service_by_pid "SupportService"
stop_service_by_pid "frontend"

# Wait a moment for processes to stop
sleep 3

# Check if any processes are still running
echo "🔍 Checking for remaining processes..."

# Check Spring Boot processes
if pgrep -f "spring-boot:run" > /dev/null; then
    echo "⚠️  Some Spring Boot processes are still running. Force killing..."
    pkill -KILL -f "spring-boot:run" 2>/dev/null || true
fi

# Check Next.js processes
if pgrep -f "next dev" > /dev/null; then
    echo "⚠️  Some Next.js processes are still running. Force killing..."
    pkill -KILL -f "next dev" 2>/dev/null || true
fi

# Check ports using netstat (Windows compatible)
echo "🔍 Checking if ports are free..."

ports=(8081 9091 9092 9093 9095 3000)
for port in "${ports[@]}"; do
    if netstat -an | grep ":$port " | grep "LISTENING" > /dev/null 2>&1; then
        echo "⚠️  Port $port is still in use. You may need to manually stop the process."
        echo "   Use: netstat -ano | findstr :$port"
    else
        echo "✅ Port $port is free"
    fi
done

echo ""
echo "🎉 All services stopped successfully!"
echo ""
echo "📝 To start services again, run: ./start-services.sh"
echo "" 