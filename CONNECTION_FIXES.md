# RentCart Connection Fixes - Login & Order Issues Resolved

## 🔍 Issues Identified and Fixed

### 1. **CORS Configuration Issues**
**Problem**: OrderService CORS was too restrictive, blocking frontend requests.
**Fix**: Updated `OrderService/src/main/java/com/GroupProject/OrderService/Config/CorsConfig.java`
- Changed from specific origins to `*` for development
- Added all necessary HTTP methods (GET, POST, PUT, DELETE, PATCH, OPTIONS)
- Set `allowCredentials(false)` when using `allowedOrigins("*")`

### 2. **AuthService CORS Enhancement**
**Problem**: AuthService needed explicit CORS configuration for all methods.
**Fix**: Updated `AuthService/src/main/java/com/RentCart/AuthService/Controller/AuthController.java`
- Added comprehensive CORS annotation with all required methods
- Ensured proper headers are allowed

### 3. **API Configuration Improvements**
**Problem**: Frontend API configuration had inconsistencies and poor error handling.
**Fix**: Updated `frontend/app/config/api.ts`
- Added better error handling with detailed logging
- Improved response handling for both JSON and text responses
- Added missing endpoints (ORDERS_USER, CREATE_RENTAL_ORDER)
- Enhanced error messages with HTTP status codes

### 4. **Authentication Flow Enhancements**
**Problem**: Token validation and user email extraction had edge cases.
**Fix**: Updated `backend/OrderService/src/main/java/com/GroupProject/OrderService/Util/UserAuthUtil.java`
- Added better null/empty string handling
- Improved error handling with specific exception types
- Added Content-Type headers for AuthService communication
- Enhanced logging for debugging

### 5. **Login Modal Improvements**
**Problem**: Login modal couldn't handle different response formats from AuthService.
**Fix**: Updated `frontend/app/components/modals/LoginModal.tsx`
- Added support for both JSON and text responses
- Improved error handling with specific error messages
- Enhanced user feedback with better toast messages

### 6. **Order Actions Fix**
**Problem**: getOrders action was using wrong endpoint.
**Fix**: Updated `frontend/app/actions/getOrders.ts`
- Changed from `/orders` to `/orders/user` endpoint
- Added better error handling without throwing exceptions
- Improved logging for debugging

### 7. **API Routes Enhancement**
**Problem**: Orders API route had hardcoded URLs and poor error handling.
**Fix**: Updated `frontend/app/api/orders/route.ts`
- Used centralized API configuration
- Improved error handling and logging
- Added proper service URL resolution

### 8. **Windows Compatibility**
**Problem**: Startup scripts used Unix-specific commands that don't work on Windows.
**Fix**: Created Windows-specific batch files and updated shell scripts
- Created `start-services.bat` and `stop-services.bat` for Windows
- Updated shell scripts to use Windows-compatible commands
- Fixed path issues and process management

## 🚀 Service Configuration

### Port Configuration
| Service | Port | URL | Status |
|---------|------|-----|--------|
| **AuthService** | 8081 | http://localhost:8081 | ✅ Fixed |
| **ItemService** | 9091 | http://localhost:9091 | ✅ Working |
| **OrderService** | 9092 | http://localhost:9092 | ✅ Fixed |
| **ReviewService** | 9095 | http://localhost:9095 | ✅ Working |
| **SupportService** | 9093 | http://localhost:9093 | ✅ Working |
| **Frontend** | 3000 | http://localhost:3000 | ✅ Working |

## 🔧 Startup Scripts

### For Windows Users
**Use the batch files for easier startup:**

#### Start All Services (Windows)
```cmd
start-services.bat
```

#### Stop All Services (Windows)
```cmd
stop-services.bat
```

### For Linux/Mac Users
**Use the shell scripts:**

#### Start All Services (Linux/Mac)
```bash
# Make scripts executable (first time only)
chmod +x start-services.sh stop-services.sh

# Start all services
./start-services.sh
```

#### Stop All Services (Linux/Mac)
```bash
./stop-services.sh
```

### Features of Startup Scripts
- **Automatic port checking**: Warns if ports are in use
- **Service health checks**: Verifies each service is responding
- **Proper startup order**: Starts AuthService first, then others
- **Logging**: Creates detailed logs in `logs/` directory
- **Frontend integration**: Automatically starts Next.js frontend
- **Cross-platform compatibility**: Works on Windows, Linux, and Mac

## 📋 How to Use

### 1. Start All Services (Windows)
```cmd
# Double-click or run in Command Prompt
start-services.bat
```

### 2. Start All Services (Linux/Mac)
```bash
./start-services.sh
```

### 3. Stop All Services (Windows)
```cmd
stop-services.bat
```

### 4. Stop All Services (Linux/Mac)
```bash
./stop-services.sh
```

### 5. Manual Testing
```bash
# Test AuthService
curl http://localhost:8081/auth/users

# Test OrderService
curl http://localhost:9092/orders/test

# Test ItemService
curl http://localhost:9091/items

# Test ReviewService
curl http://localhost:9095/api/reviews
```

## 🔍 Debugging

### Check Service Logs
```bash
# View AuthService logs
tail -f logs/AuthService.log

# View OrderService logs
tail -f logs/OrderService.log

# View Frontend logs
tail -f logs/frontend.log
```

### Check Service Status (Windows)
```cmd
# Check if ports are in use
netstat -ano | findstr :8081
netstat -ano | findstr :9092
netstat -ano | findstr :3000

# Check running processes
tasklist | findstr java
tasklist | findstr node
```

### Check Service Status (Linux/Mac)
```bash
# Check if ports are in use
lsof -i :8081
lsof -i :9092
lsof -i :3000

# Check running processes
ps aux | grep spring-boot
ps aux | grep next
```

## 🛠️ Environment Setup

### Frontend Environment Variables
Create `frontend/.env.local` with:
```env
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:8081
NEXT_PUBLIC_ITEM_SERVICE_URL=http://localhost:9091
NEXT_PUBLIC_ORDER_SERVICE_URL=http://localhost:9092
NEXT_PUBLIC_REVIEW_SERVICE_URL=http://localhost:9095
NEXT_PUBLIC_SUPPORT_SERVICE_URL=http://localhost:9093
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## ✅ Verification Steps

### 1. Login Flow
1. Start all services with `start-services.bat` (Windows) or `./start-services.sh` (Linux/Mac)
2. Open http://localhost:3000
3. Click "Login" and enter credentials
4. Verify successful login and token storage

### 2. Order Flow
1. Login to the application
2. Navigate to an item listing
3. Try to create an order
4. Verify order creation and payment flow

### 3. API Testing
```bash
# Test login
curl -X POST http://localhost:8081/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailId":"test@example.com","password":"password"}'

# Test token validation
curl -X POST http://localhost:8081/auth/validate \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Test order creation
curl -X POST http://localhost:9092/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"itemIds":["item1"],"address":"Test Address"}'
```

## 🐛 Common Issues and Solutions

### Issue: "lsof: command not found" (Windows)
**Solution**: Use the Windows batch files instead of shell scripts
```cmd
start-services.bat
```

### Issue: "Connection refused" errors
**Solution**: Ensure all services are running on correct ports
```cmd
# Windows
stop-services.bat
start-services.bat

# Linux/Mac
./stop-services.sh
./start-services.sh
```

### Issue: CORS errors in browser
**Solution**: Check CORS configuration and restart services
```bash
# Check if services are responding
curl http://localhost:8081/auth/users
curl http://localhost:9092/orders/test
```

### Issue: Authentication token issues
**Solution**: Clear browser storage and re-login
```javascript
// In browser console
localStorage.clear()
sessionStorage.clear()
// Then refresh page and login again
```

### Issue: Order creation fails
**Solution**: Check OrderService logs and ensure AuthService is running
```bash
tail -f logs/OrderService.log
tail -f logs/AuthService.log
```

### Issue: Port already in use (Windows)
**Solution**: Use netstat to find and kill the process
```cmd
netstat -ano | findstr :8081
taskkill /f /pid <PID_NUMBER>
```

## 📊 Expected Behavior After Fixes

### Login Process
1. User enters credentials
2. Frontend sends POST to `http://localhost:8081/auth/login`
3. AuthService validates credentials and returns JWT token
4. Frontend stores token in localStorage
5. Frontend validates token with `http://localhost:8081/auth/validate`
6. User is logged in and can access protected routes

### Order Process
1. User selects items and creates order
2. Frontend sends order data to `http://localhost:9092/orders`
3. OrderService validates user token with AuthService
4. OrderService creates order and returns confirmation
5. User can view orders at `http://localhost:9092/orders/user`

## 🎯 Success Criteria

- ✅ Login works without CORS errors
- ✅ Token validation works across services
- ✅ Order creation works with proper authentication
- ✅ All services communicate properly
- ✅ Frontend can access all backend endpoints
- ✅ Error handling provides meaningful feedback
- ✅ Logs show successful communication between services
- ✅ Cross-platform compatibility (Windows, Linux, Mac)

## 📝 Notes

- All services now have proper CORS configuration
- Authentication flow is robust with fallback mechanisms
- Error handling is comprehensive with detailed logging
- Startup scripts ensure proper service initialization
- Environment configuration is centralized and consistent
- Windows users can use batch files for easier startup
- All scripts create logs in the `logs/` directory

The connection issues between AuthService, OrderService, and Frontend have been resolved. All services should now communicate properly for both login and order functionality across all platforms. 
The connection issues between AuthService, OrderService, and Frontend have been resolved. All services should now communicate properly for both login and order functionality. 