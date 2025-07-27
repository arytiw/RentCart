# 📁 RentCart Project Structure

## 🎯 Clean Organization Overview

```
RentCart/
├── 📁 frontend/                    # Next.js Frontend Application
├── 📁 backend/                     # Spring Boot Microservices
├── 📄 README.md                    # Main project documentation
├── 📄 start-services.sh           # Service startup script
├── 📄 .gitignore                  # Git ignore rules
├── 📄 CLEAN_ARCHITECTURE.md       # Architecture documentation
├── 📄 PROJECT_STRUCTURE.md        # This file
├── 📄 CURRENT_STATUS.md           # Current system status
├── 📄 SERVICE_PORTS.md            # Service port configuration
├── 📄 RAZORPAY_SETUP.md           # Payment integration guide
└── 📄 ENHANCED_BOOKING_SYSTEM.md  # Booking system documentation
```

## 🏗️ Frontend Structure

```
frontend/
├── 📁 app/                        # Next.js App Router
│   ├── 📁 config/                 # API Configuration
│   │   └── 📄 api.ts             # Centralized API config
│   ├── 📁 actions/                # Service API Calls
│   │   ├── 📄 getCurrentUser.ts
│   │   ├── 📄 getListings.ts
│   │   ├── 📄 getItemById.ts
│   │   ├── 📄 getUserItems.ts
│   │   └── 📄 getOrders.ts
│   ├── 📁 api/                    # Next.js API Routes (Proxies)
│   │   ├── 📁 items/
│   │   ├── 📁 orders/
│   │   ├── 📁 reviews/
│   │   └── 📁 support/
│   ├── 📁 components/             # React Components
│   │   ├── 📁 modals/
│   │   ├── 📁 navbar/
│   │   ├── 📁 listings/
│   │   └── 📁 inputs/
│   ├── 📁 hooks/                  # Custom React Hooks
│   ├── 📁 providers/              # Context Providers
│   ├── 📁 types/                  # TypeScript Definitions
│   └── 📄 layout.tsx             # Root layout
├── 📁 public/                     # Static Assets
├── 📄 package.json               # Dependencies
├── 📄 tsconfig.json              # TypeScript config
├── 📄 tailwind.config.js         # Tailwind CSS config
├── 📄 next.config.js             # Next.js config
└── 📄 README.md                  # Frontend documentation
```

## 🔧 Backend Structure

```
backend/
├── 📁 AuthService/                # Authentication Microservice
│   ├── 📁 src/
│   │   ├── 📁 main/
│   │   │   ├── 📁 java/
│   │   │   │   └── 📁 com/RentCart/AuthService/
│   │   │   │       ├── 📁 Controller/
│   │   │   │       ├── 📁 Entity/
│   │   │   │       ├── 📁 Repository/
│   │   │   │       ├── 📁 Services/
│   │   │   │       └── 📁 Config/
│   │   │   └── 📁 resources/
│   │   │       └── 📄 application.properties
│   │   └── 📁 test/
│   ├── 📄 pom.xml                # Maven dependencies
│   ├── 📄 mvnw                   # Maven wrapper
│   └── 📄 mvnw.cmd               # Maven wrapper (Windows)
├── 📁 ItemService/                # Item Management Microservice
│   ├── 📁 src/
│   │   ├── 📁 main/
│   │   │   ├── 📁 java/
│   │   │   │   └── 📁 com/GroupProject/ItemService/
│   │   │   │       ├── 📁 Controllers/
│   │   │   │       ├── 📁 Entity/
│   │   │   │       └── 📁 Repository/
│   │   │   └── 📁 resources/
│   │   │       └── 📄 application.properties
│   │   └── 📁 test/
│   ├── 📄 pom.xml
│   ├── 📄 mvnw
│   └── 📄 mvnw.cmd
├── 📁 OrderService/               # Order Processing Microservice
│   ├── 📁 src/
│   │   ├── 📁 main/
│   │   │   ├── 📁 java/
│   │   │   │   └── 📁 com/GroupProject/OrderService/
│   │   │   │       ├── 📁 Controller/
│   │   │   │       ├── 📁 Entity/
│   │   │   │       ├── 📁 Repository/
│   │   │   │       └── 📁 Services/
│   │   │   └── 📁 resources/
│   │   │       ├── 📄 application.properties
│   │   │       └── 📄 logback-spring.xml
│   │   └── 📁 test/
│   ├── 📄 pom.xml
│   ├── 📄 mvnw
│   └── 📄 mvnw.cmd
├── 📁 Review/                     # Review System Microservice
│   ├── 📁 src/
│   │   ├── 📁 main/
│   │   │   ├── 📁 java/
│   │   │   │   └── 📁 com/GroupProject/Review/
│   │   │   │       ├── 📁 Controller/
│   │   │   │       ├── 📁 Entity/
│   │   │   │       └── 📁 Repository/
│   │   │   └── 📁 resources/
│   │   │       └── 📄 application.properties
│   │   └── 📁 test/
│   ├── 📄 pom.xml
│   ├── 📄 mvnw
│   └── 📄 mvnw.cmd
├── 📁 Support/                    # Support Chat Microservice
│   ├── 📁 src/
│   │   ├── 📁 main/
│   │   │   ├── 📁 java/
│   │   │   │   └── 📁 com/GroupProject/Support/
│   │   │   │       ├── 📁 Controller/
│   │   │   │       └── 📁 Services/
│   │   │   └── 📁 resources/
│   │   │       └── 📄 application.properties
│   │   └── 📁 test/
│   ├── 📄 pom.xml
│   ├── 📄 mvnw
│   └── 📄 mvnw.cmd
└── 📁 logs/                       # Service Logs
    ├── 📄 AuthService.log
    ├── 📄 ItemService.log
    ├── 📄 OrderService.log
    ├── 📄 Review Service.log
    └── 📄 Support.log
```

## 🚫 Removed Components

### ❌ **Root Level Removals**
- `package.json` - No longer needed at root
- `package-lock.json` - No longer needed at root
- `node_modules/` - Moved to frontend only
- `.next/` - Build output, regenerated
- `.DS_Store` - OS file, ignored

### ❌ **Frontend Removals**
- `prisma/` - Database access removed
- `pages/` - Using App Router only
- `readme-images/` - Unnecessary assets
- `.vscode/` - IDE specific
- `node_modules/` - Regenerated on install

### ❌ **Backend Removals**
- `target/` - Build output, regenerated
- `.metadata/` - IDE specific files
- Build artifacts - Cleaned from all services

## ✅ **Clean Architecture Benefits**

### 🎯 **Clear Separation**
- **Frontend**: Pure UI layer only
- **Backend**: Business logic only
- **Database**: Accessed only by services

### 📁 **Organized Structure**
- **Root**: Project documentation and scripts
- **Frontend**: Next.js application
- **Backend**: Spring Boot microservices
- **Logs**: Centralized logging

### 🔧 **Easy Development**
- **Service Isolation**: Each service is independent
- **Clear Dependencies**: No cross-service dependencies
- **Simple Navigation**: Logical folder structure
- **Clean Builds**: No unnecessary files

## 🚀 **Development Workflow**

### **Starting Services**
```bash
# Start all backend services
./start-services.sh

# Start frontend
cd frontend
npm install
npm run dev
```

### **Service Development**
```bash
# Work on specific service
cd backend/AuthService
mvn spring-boot:run

# Work on frontend
cd frontend
npm run dev
```

### **Adding Features**
1. **Backend**: Add to appropriate microservice
2. **Frontend**: Add UI components and API integration
3. **Configuration**: Update centralized API config
4. **Documentation**: Update relevant docs

## 📊 **File Count Summary**

- **Root Files**: 10 essential files
- **Frontend**: Clean Next.js structure
- **Backend**: 5 microservices + logs
- **Documentation**: 6 comprehensive guides

## 🎯 **Key Principles**

1. **Single Responsibility**: Each folder has one purpose
2. **Clean Dependencies**: No unnecessary files
3. **Clear Navigation**: Logical folder structure
4. **Easy Maintenance**: Organized and documented
5. **Scalable Design**: Microservices ready for scaling

---

**Result**: A clean, organized, and maintainable project structure that follows microservices best practices. 