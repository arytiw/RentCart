#!/bin/bash

# RentCart Microservices Startup Script
# This script starts all backend services and the frontend

echo "🚀 Starting RentCart Microservices..."

# Function to check if a port is in use (Windows compatible)
check_port() {
    local port=$1
    # Use netstat instead of lsof for Windows compatibility
    if netstat -an | grep ":$port " | grep "LISTENING" > /dev/null 2>&1; then
        echo "⚠️  Port $port is already in use. Please stop the process manually."
        echo "   You can use: netstat -ano | findstr :$port"
        return 1
    fi
    return 0
}

# Function to start a service
start_service() {
    local service_name=$1
    local port=$2
    local directory=$3
    
    echo "🔧 Starting $service_name on port $port..."
    
    # Check if port is available
    if ! check_port $port; then
        echo "❌ Cannot start $service_name - port $port is in use"
        return 1
    fi
    
    # Create logs directory if it doesn't exist
    mkdir -p logs
    
    cd "$directory" || exit 1
    
    # Start the service in background
    echo "📝 Starting $service_name..."
    nohup mvn spring-boot:run > "../logs/${service_name}.log" 2>&1 &
    local pid=$!
    echo $pid > "../logs/${service_name}.pid"
    
    echo "⏳ Waiting for $service_name to start..."
    # Wait for service to start (simplified check)
    sleep 10
    
    # Simple check if service is responding
    if curl -s "http://localhost:$port" > /dev/null 2>&1 || curl -s "http://localhost:$port/actuator/health" > /dev/null 2>&1; then
        echo "✅ $service_name appears to be running on port $port"
    else
        echo "⚠️  $service_name may still be starting up on port $port"
    fi
    
    cd ..
}

# Create logs directory if it doesn't exist
mkdir -p logs

# Kill any existing processes (Windows compatible)
echo "🧹 Cleaning up existing processes..."
pkill -f "spring-boot:run" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true

# Wait a moment for processes to stop
sleep 3

# Start AuthService first (port 8081)
start_service "AuthService" 8081 "backend/AuthService"

# Start ItemService (port 9091)
start_service "ItemService" 9091 "backend/ItemService"

# Start OrderService (port 9092)
start_service "OrderService" 9092 "backend/OrderService"

# Start Review Service (port 9095)
start_service "ReviewService" 9095 "backend/Review"

# Start Support Service (port 9093)
start_service "SupportService" 9093 "backend/Support"

# Wait for all services to be ready
echo "⏳ Waiting for all services to be ready..."
sleep 15

# Test all services
echo "🧪 Testing all services..."

# Test AuthService
if curl -s "http://localhost:8081/auth/users" > /dev/null 2>&1; then
    echo "✅ AuthService is responding"
else
    echo "❌ AuthService is not responding"
fi

# Test ItemService
if curl -s "http://localhost:9091/items" > /dev/null 2>&1; then
    echo "✅ ItemService is responding"
else
    echo "❌ ItemService is not responding"
fi

# Test OrderService
if curl -s "http://localhost:9092/orders/test" > /dev/null 2>&1; then
    echo "✅ OrderService is responding"
else
    echo "❌ OrderService is not responding"
fi

# Test Review Service
if curl -s "http://localhost:9095/api/reviews" > /dev/null 2>&1; then
    echo "✅ ReviewService is responding"
else
    echo "❌ ReviewService is not responding"
fi

# Test Support Service
if curl -s "http://localhost:9093" > /dev/null 2>&1; then
    echo "✅ SupportService is responding"
else
    echo "❌ SupportService is not responding"
fi

# Start Frontend
echo "🌐 Starting Frontend..."
cd frontend || exit 1

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start frontend in background
echo "🚀 Starting Next.js frontend..."
nohup npm run dev > "../logs/frontend.log" 2>&1 &
frontend_pid=$!
echo $frontend_pid > "../logs/frontend.pid"

cd ..

# Wait for frontend to start
echo "⏳ Waiting for frontend to start..."
sleep 15

# Test frontend
if curl -s "http://localhost:3000" > /dev/null 2>&1; then
    echo "✅ Frontend is running on http://localhost:3000"
else
    echo "❌ Frontend is not responding"
fi

echo ""
echo "🎉 All services started successfully!"
echo ""
echo "📊 Service Status:"
echo "   AuthService:    http://localhost:8081"
echo "   ItemService:    http://localhost:9091"
echo "   OrderService:   http://localhost:9092"
echo "   ReviewService:  http://localhost:9095"
echo "   SupportService: http://localhost:9093"
echo "   Frontend:       http://localhost:3000"
echo ""
echo "📝 Logs are available in the logs/ directory"
echo "🛑 To stop all services, run: ./stop-services.sh"
echo ""
echo "💡 If some services show as not responding, they may still be starting up."
echo "   Check the logs in the logs/ directory for more details."
echo "" 