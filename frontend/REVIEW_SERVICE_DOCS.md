# Review Service Testing Documentation

## Overview
This documentation covers the Review Service implementation for the RentCart application, including both the JavaScript service module and testing interfaces.

## Files Created

### 1. Review Service Module (`/src/services/reviewService.js`)
A comprehensive JavaScript module that handles all interactions with the Review microservice.

#### Features:
- **Connection Testing**: Test connectivity to the Review service
- **CRUD Operations**: Create, Read, Update, Delete reviews
- **Search Functionality**: Search reviews by item ID or user ID
- **Data Validation**: Validate review data before submission
- **Utility Functions**: Format dates, calculate average ratings, render star ratings

#### API Methods:
- `testConnection()` - Test connection to review service
- `addReview(reviewData)` - Add a new review
- `getReviewById(reviewId)` - Get specific review by ID
- `getReviewsByItemId(itemId)` - Get all reviews for an item
- `getReviewsByUserId(userId)` - Get all reviews by a user
- `getAllReviews()` - Get all reviews
- `deleteReview(reviewId)` - Delete a review
- `getAverageRating(itemId)` - Calculate average rating for an item
- `validateReviewData(reviewData)` - Validate review data

### 2. React Test Component (`/src/components/ReviewTest.jsx`)
A comprehensive React component for testing the Review service within the React application.

#### Features:
- Bootstrap UI components
- Real-time connection status
- Form validation
- Interactive review management
- Search and filter functionality
- Delete confirmation dialogs

### 3. Standalone HTML Test Page (`/public/review-test.html`)
A standalone HTML page that can be accessed directly without React.

#### Features:
- Pure JavaScript implementation
- Bootstrap styling
- Complete CRUD functionality
- Accessible via `/review-test.html`
- No build dependencies

### 4. Updated Main Application (`/src/App.jsx`)
Modified to include navigation to the Review test component.

#### Features:
- Navigation bar with Review Test link
- Page routing system
- Maintained existing Home page

## Backend Review Service Endpoints

Based on the Spring Boot controller analysis:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews/greet` | Test connection |
| POST | `/api/reviews` | Add new review |
| GET | `/api/reviews/{id}` | Get review by ID |
| GET | `/api/reviews/item/{itemId}` | Get reviews for item |
| GET | `/api/reviews/user/{userId}` | Get reviews by user |
| GET | `/api/reviews` | Get all reviews |
| DELETE | `/api/reviews/{id}` | Delete review |

## Review Data Structure

```javascript
{
  id: "string",           // Auto-generated MongoDB ID
  itemId: "string",       // ID of the item being reviewed
  userId: "string",       // ID of the user writing the review
  comment: "string",      // Review comment/text
  rating: number,         // Rating from 1-5
  timestamp: number       // Unix timestamp
}
```

## How to Access the Test Interface

### Option 1: React Component (Within Main App)
1. Start the frontend application: `npm run dev`
2. Navigate to the main application
3. Click "Review Test" in the navigation bar

### Option 2: Standalone HTML Page
1. Start the frontend application: `npm run dev`
2. Click the "Review Service Test" button in the top-right corner
3. Or directly navigate to `/review-test.html`

### Option 3: Direct File Access
1. Open `/public/review-test.html` directly in a browser
2. Ensure the Review service is running on port 9090

## Prerequisites

### Backend Service
1. Start the Review microservice (Spring Boot application)
2. Ensure it's running on `http://localhost:9090`
3. MongoDB should be connected and accessible

### Frontend Application
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Application will run on `http://localhost:5173` (or similar)

## Testing Scenarios

### 1. Connection Test
- Click "Test Connection" to verify service availability
- Should return "Hello World" message

### 2. Add Review
- Fill in Item ID, User ID, rating, and comment
- Submit the form
- Review should be added to the database

### 3. Load All Reviews
- Click "Load All Reviews" to fetch all reviews
- Reviews will be displayed in cards

### 4. Search Reviews
- Enter an Item ID or User ID in the search field
- Click "By Item" or "By User" to filter reviews

### 5. Delete Review
- Click "Delete" on any review card
- Confirm deletion in the dialog

## Error Handling

The service includes comprehensive error handling for:
- Network connectivity issues
- HTTP status errors
- Invalid data submission
- Missing required fields
- Service unavailability

## CORS Configuration

The backend Review service includes CORS configuration:
```java
@CrossOrigin(origins = "*")
```

This allows the frontend to make requests from any origin.

## Development Notes

1. **Service URL**: Currently hardcoded to `http://localhost:9090`
2. **Error Messages**: Displayed as Bootstrap alerts
3. **Loading States**: Buttons are disabled during API calls
4. **Data Persistence**: All data is stored in MongoDB
5. **Real-time Updates**: UI updates immediately after operations

## Future Enhancements

1. **Authentication**: Add user authentication for review management
2. **Pagination**: Implement pagination for large review lists
3. **Sorting**: Add sorting options (date, rating, etc.)
4. **Filtering**: Advanced filtering by rating range, date range
5. **Image Upload**: Allow images in reviews
6. **Moderation**: Admin panel for review moderation
7. **Analytics**: Review statistics and insights

## Troubleshooting

### Common Issues:

1. **Connection Failed**
   - Ensure Review service is running
   - Check if port 9090 is accessible
   - Verify CORS configuration

2. **Reviews Not Loading**
   - Check MongoDB connection
   - Verify database has review data
   - Check browser console for errors

3. **Cannot Add Review**
   - Verify all required fields are filled
   - Check data validation rules
   - Ensure proper JSON format

4. **Delete Not Working**
   - Confirm review ID exists
   - Check delete permissions
   - Verify backend delete endpoint

## API Examples

### Add Review
```javascript
const reviewData = {
  itemId: "item123",
  userId: "user456",
  comment: "Great product!",
  rating: 5
};

const result = await reviewService.addReview(reviewData);
```

### Search Reviews
```javascript
// By item
const itemReviews = await reviewService.getReviewsByItemId("item123");

// By user
const userReviews = await reviewService.getReviewsByUserId("user456");
```

### Calculate Average Rating
```javascript
const avgRating = await reviewService.getAverageRating("item123");
console.log(`Average rating: ${avgRating}`);
```

This implementation provides a complete testing framework for the Review microservice with both React-based and standalone HTML interfaces.
