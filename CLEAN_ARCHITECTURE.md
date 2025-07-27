# 🏗️ RentCart Clean Microservices Architecture

## 🎯 Overview

This document outlines the **cleaned and optimized microservices architecture** for RentCart, where the frontend serves purely as a UI layer and all backend logic is properly separated into Spring Boot microservices.

## 🚫 What Was Removed

### ❌ Prisma ORM
- **Removed**: `frontend/prisma/schema.prisma`
- **Removed**: `frontend/app/libs/prismadb.ts`
- **Removed**: Prisma dependencies from `package.json`
- **Why**: Database access should only be through Spring Boot services

### ❌ NextAuth.js
- **Removed**: `frontend/pages/api/auth/[...nextauth].ts`
- **Removed**: NextAuth dependencies from `package.json`
- **Why**: Authentication is handled by AuthService with JWT

### ❌ Database Logic in Frontend
- **Removed**: Direct database operations
- **Removed**: Prisma queries in components
- **Why**: All business logic belongs in microservices

### ❌ Hardcoded URLs
- **Removed**: Hardcoded service URLs throughout codebase
- **Replaced**: With centralized API configuration

## ✅ What Was Added

### ✅ Centralized API Configuration
```typescript
// app/config/api.ts
export const API_CONFIG = {
  AUTH_SERVICE: 'http://localhost:8081',
  ITEM_SERVICE: 'http://localhost:9091',
  ORDER_SERVICE: 'http://localhost:9092',
  REVIEW_SERVICE: 'http://localhost:9095',
  SUPPORT_SERVICE: 'http://localhost:9093',
  // ... endpoints
};
```

### ✅ Clean Type Definitions
```typescript
// app/types/index.ts
export interface User {
  id: string;
  email: string;
  emailId: string;
  // ... other fields
}
```

### ✅ API Client
```typescript
export const apiClient = {
  get: async (url: string, headers?: Record<string, string>) => { /* ... */ },
  post: async (url: string, data: any, headers?: Record<string, string>) => { /* ... */ },
  // ... other methods
};
```

## 🏛️ Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Routes    │    │  Microservices  │
│   (Next.js)     │───▶│   (Proxies)     │───▶│  (Spring Boot)  │
│                 │    │                 │    │                 │
│ • UI Components │    │ • /api/items    │    │ • AuthService   │
│ • State Mgmt    │    │ • /api/orders   │    │ • ItemService   │
│ • Form Handling │    │ • /api/reviews  │    │ • OrderService  │
│ • TypeScript    │    │ • /api/support  │    │ • ReviewService │
└─────────────────┘    └─────────────────┘    │ • SupportService│
                                              └─────────────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │   MongoDB       │
                                              │   Atlas         │
                                              │                 │
                                              │ • User Data     │
                                              │ • Items         │
                                              │ • Orders        │
                                              │ • Reviews       │
                                              └─────────────────┘
```

## 🔄 Data Flow

### 1. User Authentication
```
Frontend → LoginModal → AuthService → MongoDB
     ↓
JWT Token → LocalStorage → UserProvider → Components
```

### 2. Item Management
```
Frontend → getListings() → ItemService → MongoDB
     ↓
Items → Components → Display
```

### 3. Order Processing
```
Frontend → BookingModal → OrderService → MongoDB
     ↓
Order Confirmation → Email → User
```

### 4. Review System
```
Frontend → ReviewModal → ReviewService → MongoDB
     ↓
Reviews → Item Display → Rating Calculation
```

## 🛠️ Service Responsibilities

### AuthService (Port 8081)
- **User Registration & Login**
- **JWT Token Generation & Validation**
- **Password Reset**
- **User Profile Management**

### ItemService (Port 9091)
- **Item CRUD Operations**
- **Item Search & Filtering**
- **User Item Management**
- **Item Availability**

### OrderService (Port 9092)
- **Order Creation & Management**
- **Payment Processing (Razorpay)**
- **Order Confirmation**
- **Email Notifications**

### ReviewService (Port 9095)
- **Review Creation & Retrieval**
- **Rating Calculations**
- **Review Analytics**

### SupportService (Port 9093)
- **AI Chat Support**
- **Customer Service**
- **FAQ Management**

## 📁 File Structure

```
RentCart/
├── frontend/                    # Pure UI Layer
│   ├── app/
│   │   ├── config/
│   │   │   └── api.ts          # Centralized API config
│   │   ├── actions/            # Service API calls
│   │   ├── api/               # Next.js API routes
│   │   ├── components/        # React components
│   │   ├── types/            # TypeScript definitions
│   │   └── providers/        # Context providers
│   └── package.json
├── AuthService/               # Authentication microservice
├── ItemService/              # Item management microservice
├── OrderService/             # Order processing microservice
├── Review/                   # Review system microservice
├── Support/                  # Support chat microservice
└── README.md
```

## 🔧 Configuration

### Environment Variables
```bash
# Frontend (.env.local)
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:8081
NEXT_PUBLIC_ITEM_SERVICE_URL=http://localhost:9091
NEXT_PUBLIC_ORDER_SERVICE_URL=http://localhost:9092
NEXT_PUBLIC_REVIEW_SERVICE_URL=http://localhost:9095
NEXT_PUBLIC_SUPPORT_SERVICE_URL=http://localhost:9093
```

### Service Configuration
Each Spring Boot service has its own `application.properties`:
- **Port Configuration**: Unique ports for each service
- **Database Connection**: Shared MongoDB Atlas
- **CORS Configuration**: Allow frontend domain
- **Logging**: Structured logging with logback

## 🚀 Benefits of Clean Architecture

### ✅ **Separation of Concerns**
- Frontend: UI/UX only
- Backend: Business logic only
- Database: Data persistence only

### ✅ **Scalability**
- Services can be scaled independently
- Load balancing per service
- Horizontal scaling capability

### ✅ **Maintainability**
- Clear service boundaries
- Easy to debug and test
- Independent deployment

### ✅ **Technology Consistency**
- All backend: Spring Boot + MongoDB
- All frontend: Next.js + TypeScript
- No mixed database access patterns

### ✅ **Security**
- Centralized authentication
- JWT token validation
- Proper CORS configuration

## 🔍 Code Examples

### Frontend API Call
```typescript
// Before (hardcoded)
const response = await fetch('http://localhost:9091/items');

// After (centralized)
const url = buildUrl('ITEM_SERVICE', API_CONFIG.ENDPOINTS.ITEMS);
const items = await apiClient.get(url);
```

### Service Communication
```typescript
// Clean service-to-service communication
const userData = await apiClient.post(
  buildUrl('AUTH_SERVICE', API_CONFIG.ENDPOINTS.VALIDATE_TOKEN),
  {},
  { 'Authorization': `Bearer ${token}` }
);
```

### Type Safety
```typescript
// Custom types instead of Prisma types
export interface User {
  id: string;
  email: string;
  emailId: string;
  // ... other fields
}
```

## 🚫 Anti-Patterns Avoided

### ❌ **Database Access from Frontend**
```typescript
// DON'T DO THIS
const user = await prisma.user.findUnique({ where: { email } });
```

### ❌ **Mixed Authentication**
```typescript
// DON'T DO THIS
import { signIn } from "next-auth/react";
```

### ❌ **Hardcoded URLs**
```typescript
// DON'T DO THIS
const response = await fetch('http://localhost:9091/items');
```

### ❌ **Business Logic in Frontend**
```typescript
// DON'T DO THIS
const calculatePrice = (item) => { /* complex logic */ };
```

## 🎯 Best Practices

### ✅ **Use Centralized Configuration**
```typescript
import { buildUrl, apiClient, API_CONFIG } from '../config/api';
```

### ✅ **Implement Proper Error Handling**
```typescript
try {
  const data = await apiClient.get(url);
  return data;
} catch (error) {
  console.error('API Error:', error);
  throw new Error('Failed to fetch data');
}
```

### ✅ **Type Everything**
```typescript
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
```

### ✅ **Keep Components Pure**
```typescript
// Good: Component only handles UI
const ItemCard = ({ item }: { item: Item }) => {
  return <div>{item.title}</div>;
};
```

## 🚀 Next Steps

1. **Service Discovery**: Implement Eureka or Consul
2. **API Gateway**: Add Spring Cloud Gateway
3. **Load Balancing**: Configure load balancers
4. **Monitoring**: Add health checks and metrics
5. **Caching**: Implement Redis for caching
6. **Message Queue**: Add RabbitMQ/Kafka for async operations

---

**Result**: A clean, scalable, and maintainable microservices architecture where each component has a single responsibility and clear boundaries. 