# 🏗️ RentCart - Clean Microservices Architecture

A modern rental platform built with **Spring Boot microservices** and **Next.js frontend**.

## 🎯 Architecture Overview

```
RentCart/
├── frontend/          # Next.js UI Layer
├── backend/           # Spring Boot Microservices
│   ├── AuthService/   # Authentication & User Management
│   ├── ItemService/   # Item/Listing Management
│   ├── OrderService/  # Order Processing & Payments
│   ├── Review/        # Review & Rating System
│   ├── Support/       # Customer Support & Chat
│   └── logs/          # Service Logs
├── start-services.sh  # Service Startup Script
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- **Java 17+**
- **Node.js 18+**
- **MongoDB Atlas** (configured in services)

### 1. Start Backend Services
```bash
# Start all Spring Boot microservices
./start-services.sh
```

**Services will be available at:**
- AuthService: http://localhost:8081
- ItemService: http://localhost:9091
- OrderService: http://localhost:9092
- ReviewService: http://localhost:9095
- SupportService: http://localhost:9093

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

**Frontend will be available at:** http://localhost:3000

## 🏛️ Architecture Principles

### ✅ **Clean Separation**
- **Frontend**: Pure UI layer (Next.js + TypeScript)
- **Backend**: Business logic (Spring Boot microservices)
- **Database**: MongoDB Atlas (accessed only by services)

### ✅ **Microservices Design**
- **AuthService**: JWT authentication & user management
- **ItemService**: Item CRUD & search functionality
- **OrderService**: Order processing & payment integration
- **ReviewService**: Review system & rating calculations
- **SupportService**: AI-powered customer support

### ✅ **Technology Stack**
- **Backend**: Spring Boot 3.5.3, Java 17, MongoDB
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Authentication**: JWT with Spring Security
- **Payments**: Razorpay integration
- **Deployment**: Docker-ready

## 🔧 Configuration

### Environment Variables
Each service has its own `application.properties`:
- **Database**: MongoDB Atlas connection
- **Ports**: Unique ports for each service
- **CORS**: Configured for frontend domain
- **Logging**: Structured logging with logback

### Service Communication
- **REST APIs**: HTTP/JSON communication
- **Centralized Config**: Frontend uses centralized API configuration
- **Error Handling**: Consistent error responses
- **Authentication**: JWT token validation

## 📊 Features

### 🔐 **Authentication & Security**
- JWT-based authentication
- Password reset functionality
- User profile management
- Secure API endpoints

### 🛍️ **Item Management**
- Create, update, delete items
- Advanced search & filtering
- Image upload support
- Category management

### 💳 **Order Processing**
- Secure payment integration
- Order confirmation
- Email notifications
- Booking management

### ⭐ **Review System**
- User reviews & ratings
- Average rating calculations
- Review analytics
- Quality assurance

### 🤖 **AI Support**
- Intelligent chat support
- FAQ management
- Customer service automation
- Context-aware responses

## 🛠️ Development

### Backend Development
```bash
# Navigate to specific service
cd backend/AuthService

# Run service
mvn spring-boot:run

# Build service
mvn clean package
```

### Frontend Development
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Adding New Features
1. **Backend**: Implement in appropriate Spring Boot service
2. **Frontend**: Add UI components and API integration
3. **API**: Update centralized configuration
4. **Types**: Add TypeScript definitions

## 📁 Project Structure

```
RentCart/
├── frontend/                    # Next.js Frontend
│   ├── app/
│   │   ├── config/             # API configuration
│   │   ├── actions/            # Service API calls
│   │   ├── api/               # Next.js API routes
│   │   ├── components/        # React components
│   │   ├── types/            # TypeScript definitions
│   │   └── providers/        # Context providers
│   └── package.json
├── backend/                    # Spring Boot Microservices
│   ├── AuthService/           # Authentication service
│   │   ├── src/main/java/
│   │   ├── pom.xml
│   │   └── application.properties
│   ├── ItemService/           # Item management service
│   ├── OrderService/          # Order processing service
│   ├── Review/                # Review system service
│   ├── Support/               # Support chat service
│   └── logs/                  # Service logs
├── start-services.sh          # Service startup script
├── CLEAN_ARCHITECTURE.md      # Architecture documentation
└── README.md
```

## 🚀 Deployment

### Backend Services
Each service can be deployed independently:
```bash
# Build service
mvn clean package

# Run with Docker
docker build -t service-name .
docker run -p port:port service-name
```

### Frontend
```bash
# Build for production
npm run build

# Deploy to Vercel/Netlify
npm run deploy
```

## 🔍 Monitoring & Logs

### Service Logs
```bash
# View service logs
tail -f backend/logs/AuthService.log
tail -f backend/logs/ItemService.log
tail -f backend/logs/OrderService.log
```

### Health Checks
- **AuthService**: http://localhost:8081/actuator/health
- **ItemService**: http://localhost:9091/actuator/health
- **OrderService**: http://localhost:9092/actuator/health

## 🤝 Contributing

1. Follow microservices architecture principles
2. Keep frontend focused on UI/UX only
3. Implement proper error handling
4. Add TypeScript types for all data
5. Update API configuration for new endpoints

## 📚 Documentation

- **[Clean Architecture Guide](CLEAN_ARCHITECTURE.md)** - Detailed architecture documentation
- **[Frontend README](frontend/README.md)** - Frontend-specific documentation
- **[Service Ports](SERVICE_PORTS.md)** - Service configuration details

## 🎯 Key Benefits

- ✅ **Scalable**: Independent service scaling
- ✅ **Maintainable**: Clear separation of concerns
- ✅ **Secure**: JWT authentication & proper validation
- ✅ **Modern**: Latest Spring Boot & Next.js versions
- ✅ **Clean**: No database access from frontend
- ✅ **Type-Safe**: Full TypeScript support

---

**Built with ❤️ using Spring Boot & Next.js** 