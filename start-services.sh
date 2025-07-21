#!/bin/bash

echo "🚀 Starting RentCart Services..."

# Function to start a service
start_service() {
    local service_name=$1
    local service_path=$2
    local port=$3
    
    echo "📦 Starting $service_name on port $port..."
    cd "$service_path" && mvn spring-boot:run > "../logs/${service_name}.log" 2>&1 &
    echo "✅ $service_name started (PID: $!)"
}

# Create logs directory
mkdir -p logs

# Kill any existing services
echo "🛑 Stopping existing services..."
pkill -f "spring-boot:run" 2>/dev/null || true
pkill -f "mvn spring-boot:run" 2>/dev/null || true

# Wait a moment
sleep 2

# Start services
start_service "Review Service" "Review" "9095"
sleep 5

start_service "ItemService" "ItemService" "9091"
sleep 5

start_service "OrderService" "OrderService" "9092"
sleep 5

echo ""
echo "🎉 All services started!"
echo ""
echo "📊 Service Status:"
echo "   Review Service: http://localhost:9095"
echo "   ItemService:    http://localhost:9091"
echo "   OrderService:   http://localhost:9092"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "📝 Logs are available in the logs/ directory"
echo ""
echo "To stop all services, run: pkill -f 'spring-boot:run'" 