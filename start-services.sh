#!/bin/bash

echo "🚀 Starting RentCart Microservices..."

check_port() {
    local port=$1
    if netstat -an | grep ":$port " | grep "LISTENING" > /dev/null 2>&1; then
        echo "⚠️  Port $port is already in use."
        return 1
    fi
    return 0
}

start_service() {
    local service_name=$1
    local port=$2
    local directory=$3
    
    echo "🔧 Starting $service_name on port $port..."
    
    if ! check_port $port; then
        echo "❌ Cannot start $service_name - port $port is in use"
        return 1
    fi

    mkdir -p logs
    cd "$directory" || exit 1
    
    nohup mvn spring-boot:run > "../logs/${service_name}.log" 2>&1 &
    local pid=$!
    echo $pid > "../logs/${service_name}.pid"
    
    echo "⏳ Waiting for $service_name to start..."
    sleep 10
    
    if curl -s "http://localhost:$port" > /dev/null 2>&1 || \
       curl -s "http://localhost:$port/actuator/health" > /dev/null 2>&1; then
        echo "✅ $service_name is running on port $port"
    else
        echo "⚠️  $service_name may still be starting..."
    fi
    
    cd - > /dev/null || exit
}

mkdir -p logs
echo "🧹 Cleaning up existing processes..."
pkill -f "spring-boot:run" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || pkill -f "next" 2>/dev/null || true

sleep 3

start_service "AuthService" 8081 "backend/AuthService"
start_service "ItemService" 9091 "backend/ItemService"
start_service "OrderService" 9092 "backend/OrderService"
start_service "ReviewService" 9095 "backend/Review"
start_service "SupportService" 9093 "backend/Support"

echo "⏳ Waiting for backend to stabilize..."
sleep 15

echo "🌐 Starting Frontend..."
cd frontend || exit 1

if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Detect framework to decide the command
if grep -q "\"next\"" package.json; then
    frontend_port=3000
    start_cmd="npm run dev"
elif grep -q "\"vite\"" package.json; then
    frontend_port=5173
    start_cmd="npm run dev"
else
    frontend_port=3000
    start_cmd="npm start"
fi

echo "🚀 Starting frontend on port $frontend_port..."
nohup $start_cmd > "../logs/frontend.log" 2>&1 &
frontend_pid=$!
echo $frontend_pid > "../logs/frontend.pid"

cd - > /dev/null || exit

echo "⏳ Waiting for frontend to start..."
sleep 15

if curl -s "http://localhost:$frontend_port" > /dev/null 2>&1; then
    echo "✅ Frontend is running on http://localhost:$frontend_port"
else
    echo "❌ Frontend is not responding. Check logs/frontend.log"
fi
