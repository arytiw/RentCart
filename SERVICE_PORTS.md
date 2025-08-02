# RentCart Service Port Configuration

## 🚀 Service Ports

| Service | Port | URL | Status |
|---------|------|-----|--------|
| **Review Service** | 9095 | http://localhost:9095 | ✅ Running |
| **ItemService** | 9091 | http://localhost:9091 | ✅ Running |
| **OrderService** | 9092 | http://localhost:9092 | ✅ Running |
| **Frontend** | 3000 | http://localhost:3000 | ✅ Running |

## 📋 Quick Start

### Option 1: Use the startup script
```bash
./start-services.sh
```

### Option 2: Start manually
```bash
# Start Review Service
cd Review && mvn spring-boot:run

# Start ItemService (in new terminal)
cd ItemService && mvn spring-boot:run

# Start OrderService (in new terminal)
cd OrderService && mvn spring-boot:run

# Start Frontend (in new terminal)
cd rentpal-main && npm run dev
```

## 🔧 Configuration Files Updated

### Review Service
- **File**: `Review/src/main/resources/application.properties`
- **Port**: 9090 ✅

### ItemService
- **File**: `ItemService/src/main/resources/application.properties`
- **Port**: 9091 ✅

### OrderService
- **File**: `OrderService/src/main/resources/application.properties`
- **Port**: 9092 ✅

## 🌐 Frontend API Endpoints Updated

### Review Service (Port 9095)
- ✅ `http://localhost:9095/api/reviews` - All reviews
- ✅ `http://localhost:9095/api/reviews/item/{itemId}` - Reviews by item
- ✅ `http://localhost:9095/api/reviews/item/{itemId}/average-rating` - Average rating

### ItemService (Port 9091)
- ✅ `http://localhost:9091/items` - All items
- ✅ `http://localhost:9091/items/{itemId}` - Item by ID
- ✅ `http://localhost:9091/items/user/{userEmail}` - User's items

### OrderService (Port 9092)
- ✅ `http://localhost:9092/orders` - All orders
- ✅ `http://localhost:9092/orders/{orderId}` - Order by ID
- ✅ `http://localhost:9092/orders/user` - User's orders

## 🧪 Testing

### Test Review Service
```bash
curl http://localhost:9095/api/reviews/greet
```

### Test ItemService
```bash
curl http://localhost:9091/items
```

### Test OrderService
```bash
curl http://localhost:9092/orders
```

### Test Frontend Integration
```bash
curl http://localhost:3000/api/test-reviews
```

## 📝 Review System Features

### ✅ Implemented Features
1. **Review Display**: Show all reviews for items
2. **Average Rating**: Dynamic rating calculation
3. **Review Submission**: Add new reviews with ratings
4. **User Authentication**: Only logged-in users can review
5. **Real-time Updates**: Ratings update immediately
6. **Error Handling**: Proper error messages and fallbacks

### 🎯 Test Items with Reviews
- `VistaPhillips123` - 3 reviews, avg rating: 1.7
- `Mixer123` - 1 review, avg rating: 4.0
- `Bike123` - 1 review, avg rating: 5.0

## 🛠️ Troubleshooting

### Port Already in Use
If you get "port already in use" errors:
```bash
# Kill all Spring Boot processes
pkill -f "spring-boot:run"

# Or kill specific port
lsof -ti:9090 | xargs kill -9
lsof -ti:9091 | xargs kill -9
lsof -ti:9092 | xargs kill -9
```

### Service Not Starting
Check the logs in the `logs/` directory:
```bash
tail -f logs/Review\ Service.log
tail -f logs/ItemService.log
tail -f logs/OrderService.log
```

## 📊 Current Status

All services are configured with unique ports and the frontend has been updated to use the correct service URLs. The review system is fully integrated and functional. 