# RentCart - Rent Your Stuff Fix Instructions

## 🚨 Issue
The "Rent Your Stuff" functionality is not working due to backend services not running.

## 🔧 Solution

### Step 1: Start Backend Services
Run the startup script to start the required services:

```bash
# Windows
start-rent-services.bat

# Or manually start each service:
cd backend/AuthService
mvn spring-boot:run

cd ../ItemService
mvn spring-boot:run

cd ../../frontend
npm run dev
```

### Step 2: Verify Services Are Running
Visit: http://localhost:3000/test-services

This page will test if the backend services are running properly.

### Step 3: Test Rent Functionality
1. Go to http://localhost:3000
2. Login or register
3. Click "Rent your stuff" button
4. Fill out the form and submit

## 🔍 Troubleshooting

### If you get 500 errors:
- Check if AuthService is running on port 8081
- Check if ItemService is running on port 9091
- Check the logs in the `logs/` directory

### If you get authentication errors:
- Make sure you're logged in
- Check if the token is valid
- Try logging out and logging back in

### If you get connection refused errors:
- The backend services are not running
- Start them using the startup script

## 📋 Required Services
- **AuthService**: Port 8081 (Authentication & User Management)
- **ItemService**: Port 9091 (Item Creation & Management)
- **Frontend**: Port 3000 (Next.js Application)

## 🛠️ Fixed Issues
1. ✅ Form data transformation (imageSrc → images, location object → string)
2. ✅ Improved error handling and validation
3. ✅ Better debugging and logging
4. ✅ Service status testing page
5. ✅ Simplified startup script

## 📝 Notes
- The rent form now properly transforms data for the API
- Better error messages for debugging
- Service status page for troubleshooting
- All TypeScript errors have been resolved 