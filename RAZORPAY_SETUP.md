# Razorpay Integration Guide

## Current Status ✅
- **Mock Mode**: Currently using mock Razorpay responses for testing
- **Order Flow**: Complete order creation and confirmation working
- **Frontend Integration**: Booking modal with Razorpay integration ready
- **Backend Services**: OrderService running on port 9092

## Issues Fixed ✅

### 1. Port Conflicts
- **Review Service**: Port 9095 ✅
- **ItemService**: Port 9091 ✅  
- **OrderService**: Port 9092 ✅
- **Frontend**: Port 3001 ✅

### 2. Razorpay Key Mismatch
- **Fixed**: Backend and frontend now use same test key
- **Frontend Key**: `rzp_test_sIJfB86OPmS019`
- **Backend Key**: `rzp_test_sIJfB86OPmS019`

### 3. CORS Configuration
- **Fixed**: OrderService now accepts requests from both port 3000 and 3001
- **Updated**: `CorsConfig.java` to allow multiple origins

### 4. Error Handling
- **Added**: Better error messages in BookingModal
- **Added**: Payment modal dismiss handler
- **Added**: Console logging for debugging

## Current Implementation

### Mock Razorpay Service
The system currently uses a mock Razorpay service for testing:

```java
// In RazorpayService.java - Mock Mode (Active)
Map<String, Object> response = new HashMap<>();
int amountInPaise = (int) (request.getAmount() * 100);
response.put("id", "order_test_" + System.currentTimeMillis());
response.put("amount", String.valueOf(amountInPaise));
response.put("currency", request.getCurrency());
response.put("receipt", request.getReceipt());
```

### Real Razorpay Integration (Commented)
To enable real Razorpay integration:

1. **Get Valid API Keys**:
   - Sign up at https://razorpay.com
   - Get test keys from Razorpay Dashboard
   - Update `application.properties`:

```properties
razorpay.key_id=your_actual_test_key_id
razorpay.key_secret=your_actual_test_key_secret
```

2. **Uncomment Real Integration**:
   - In `RazorpayService.java`, uncomment the real Razorpay code
   - Comment out the mock response code

## Testing the Order Flow

### 1. Start All Services
```bash
./start-services.sh
```

### 2. Test Order Creation
```bash
curl -X POST http://localhost:9092/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d '{
    "itemIds": ["687a13cab56ec84311698980"],
    "address": "Test Address",
    "couponCode": null,
    "paymentMode": "ONLINE"
  }'
```

### 3. Test Order Confirmation
```bash
curl -X POST http://localhost:9092/orders/confirm-with-details \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d '{
    "orderRequest": {
      "itemIds": ["687a13cab56ec84311698980"],
      "address": "Test Address",
      "couponCode": null,
      "paymentMode": "ONLINE"
    },
    "razorpayOrderId": "order_test_123",
    "razorpayPaymentId": "pay_test_123",
    "razorpaySignature": "test_signature"
  }'
```

## Frontend Booking Flow

### 1. User clicks "Book Now" on an item
### 2. BookingModal opens with item details
### 3. User fills delivery address and optional coupon
### 4. Clicks "Continue" to proceed to payment
### 5. Payment step shows order summary
### 6. Clicks "Proceed to Payment" to open Razorpay modal
### 7. User completes payment in Razorpay
### 8. Order is confirmed and user gets success message

## Troubleshooting

### Common Issues:

1. **"Authentication failed" Error**:
   - Check if Razorpay keys are valid
   - Ensure keys match between frontend and backend
   - Use mock mode for testing

2. **CORS Errors**:
   - Verify CORS configuration in OrderService
   - Check if frontend is running on allowed ports

3. **"Internal Server Error"**:
   - Check OrderService logs
   - Verify all services are running
   - Check MongoDB connection

4. **Payment Modal Not Opening**:
   - Ensure Razorpay script is loaded in layout.tsx
   - Check browser console for JavaScript errors
   - Verify Razorpay key is correct

## Production Setup

### 1. Get Production Razorpay Keys
- Contact Razorpay for production account
- Get live API keys
- Update configuration

### 2. Enable Real Integration
- Uncomment real Razorpay code in RazorpayService
- Update application.properties with production keys
- Test thoroughly in staging environment

### 3. Security Considerations
- Store API keys securely (use environment variables)
- Implement proper payment verification
- Add webhook handling for payment status updates
- Implement proper error handling and logging

## Service Status

| Service | Port | Status | URL |
|---------|------|--------|-----|
| Review Service | 9095 | ✅ Running | http://localhost:9095 |
| ItemService | 9091 | ✅ Running | http://localhost:9091 |
| OrderService | 9092 | ✅ Running | http://localhost:9092 |
| Frontend | 3001 | ✅ Running | http://localhost:3001 |

## Next Steps

1. **Test Complete Flow**: Try booking an item through the frontend
2. **Get Real Razorpay Keys**: For production use
3. **Implement Webhooks**: For payment status updates
4. **Add Email Notifications**: For order confirmations
5. **Implement Order Management**: For users to view/manage orders

## Support

For issues:
1. Check service logs in `logs/` directory
2. Verify all services are running
3. Test individual endpoints
4. Check browser console for frontend errors 