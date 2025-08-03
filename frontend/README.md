# RentCart Frontend - Clean Microservices Architecture

## 🏗️ Architecture Overview

This is a **pure microservices frontend** that serves only as a UI layer. All backend logic is handled by separate Spring Boot microservices.

### 🎯 **Architecture Principles**
- **Frontend**: Pure UI layer (Next.js + TypeScript)
- **Backend**: Spring Boot microservices (AuthService, ItemService, OrderService, Review, Support)
- **Database**: MongoDB Atlas (accessed only by Spring Boot services)
- **Authentication**: JWT-based with Spring Security

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- All Spring Boot services running (see main README)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - AuthService: http://localhost:8081
   - ItemService: http://localhost:9091
   - OrderService: http://localhost:9092
   - ReviewService: http://localhost:9095
   - SupportService: http://localhost:9093

## 🏛️ Project Structure

```
frontend/
├── app/
│   ├── config/
│   │   └── api.ts              # Centralized API configuration
│   ├── actions/                 # API calls to microservices
│   ├── api/                    # Next.js API routes (proxies)
│   ├── components/             # React components
│   ├── hooks/                  # Custom React hooks
│   ├── providers/              # Context providers
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets
└── package.json
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:

```bash
# Service URLs (optional - defaults to localhost)
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:8081
NEXT_PUBLIC_ITEM_SERVICE_URL=http://localhost:9091
NEXT_PUBLIC_ORDER_SERVICE_URL=http://localhost:9092
NEXT_PUBLIC_REVIEW_SERVICE_URL=http://localhost:9095
NEXT_PUBLIC_SUPPORT_SERVICE_URL=http://localhost:9093
```

## 🔌 API Integration

### Centralized API Configuration
All service communication is managed through `app/config/api.ts`:

```typescript
import { buildUrl, apiClient, API_CONFIG } from '../config/api';

// Example: Get items from ItemService
const url = buildUrl('ITEM_SERVICE', API_CONFIG.ENDPOINTS.ITEMS);
const items = await apiClient.get(url);
```

### Available Services
- **AuthService**: User authentication and management
- **ItemService**: Item/listing management
- **OrderService**: Order processing and payments
- **ReviewService**: Review and rating system
- **SupportService**: Customer support and chat

## 🎨 Features

- **Modern UI**: Tailwind CSS with responsive design
- **Type Safety**: Full TypeScript support
- **State Management**: Zustand for global state
- **Form Handling**: React Hook Form with validation
- **Real-time Updates**: SWR for data fetching
- **Authentication**: JWT-based with Spring Security
- **File Upload**: Cloudinary integration
- **Maps Integration**: Leaflet for location services

## 🚫 What's NOT Included

- ❌ **Prisma ORM**: Removed - database access only through Spring Boot services
- ❌ **NextAuth.js**: Removed - authentication handled by AuthService
- ❌ **Database Logic**: Removed - all business logic in microservices
- ❌ **Server-side Rendering**: Minimal - mostly client-side for better performance

## 🔄 Data Flow

```
Frontend (Next.js) → API Routes → Spring Boot Microservices → MongoDB
```

1. **Frontend Components** make API calls
2. **API Routes** proxy requests to appropriate microservices
3. **Spring Boot Services** handle business logic and database operations
4. **MongoDB** stores all data

## 🛠️ Development

### Adding New Features
1. **Frontend**: Add UI components in `app/components/`
2. **API Integration**: Update `app/config/api.ts` with new endpoints
3. **Backend**: Implement business logic in appropriate Spring Boot service
4. **Types**: Update `app/types/index.ts` for new data structures

### Best Practices
- ✅ Use centralized API configuration
- ✅ Implement proper error handling
- ✅ Add TypeScript types for all data
- ✅ Follow React best practices
- ✅ Keep components small and focused

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Setup
- Set production service URLs in environment variables
- Ensure all microservices are deployed and accessible
- Configure CORS in Spring Boot services for production domain

## 📚 Key Dependencies

- **Next.js 14**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Zustand**: State management
- **React Hook Form**: Form handling
- **SWR**: Data fetching
- **Axios**: HTTP client

## 🤝 Contributing

1. Follow the microservices architecture principles
2. Keep frontend focused on UI/UX only
3. All business logic goes in Spring Boot services
4. Use TypeScript for all new code
5. Update API configuration for new endpoints

---

**Note**: This frontend is designed to work exclusively with the RentCart microservices backend. Ensure all Spring Boot services are running before starting the frontend.
