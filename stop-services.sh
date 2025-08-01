#!/bin/bash

echo "🛑 Stopping all RentCart services..."

LOG_DIR="logs"

if [ ! -d "$LOG_DIR" ]; then
    echo "⚠️ No logs directory found. Maybe services are not running?"
    exit 0
fi

# Kill all services from PID files
for pidfile in "$LOG_DIR"/*.pid; do
    if [ -f "$pidfile" ]; then
        pid=$(cat "$pidfile")
        service=$(basename "$pidfile" .pid)
        
        if ps -p $pid > /dev/null 2>&1; then
            echo "🔹 Stopping $service (PID: $pid)"
            kill $pid 2>/dev/null
            sleep 1
            if ps -p $pid > /dev/null 2>&1; then
                echo "⚠️  $service did not stop gracefully. Forcing kill..."
                kill -9 $pid 2>/dev/null
            else
                echo "✅ $service stopped"
            fi
        else
            echo "⚠️  $service is not running (PID file: $pid)"
        fi
        
        rm -f "$pidfile"
    fi
done

echo "🧹 Cleaning up any stray processes..."
pkill -f "spring-boot:run" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || pkill -f "next" 2>/dev/null || true

echo "🎉 All services stopped."
