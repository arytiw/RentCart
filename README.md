# 🛒 Rent & Sell Platform for Personal Items

A full-stack web platform where users can **list personal items (books, gadgets, furniture, etc.) for rent or sale**, complete with secure authentication, dynamic rental pricing, online payments, AI tag suggestions, and chatbot support.

---

## 🔥 Key Features

- 🔐 JWT Authentication (Login / Signup with Buyer & Seller roles)
- 📦 Post Items for Rent or Sale
- 🔍 Advanced Search & Filters (by category, price, location)
- 📅 Rental Calendar with Price Auto-Calculation
- 💳 Online Payments (Razorpay / Stripe Integration)
- 🤖 AI-based Category/Tag Suggestions
- 💬 Chatbot Support for Instant Help
- 📧 Email/SMS Notifications for Orders
- 🌟 Ratings & Reviews for Sellers
- 📈 Admin Panel (Coming Soon)

---

## ⚙️ Tech Stack

### 🧠 Backend
- **Java Spring Boot**
- **Spring Security + JWT**
- **MySQL**
- **Spring Data JPA**
- **Maven**

### 🎨 Frontend
- **ReactJS + Vite**
- **React Router**
- **Tailwind CSS / Bootstrap**

### ☁️ DevOps / Deployment
- **Docker & Docker Compose**
- **Vercel (Frontend)** / **Render / Railway (Backend)**
- **Cloudinary (Image Uploads)**
- **Twilio / Mailgun (Notifications)**

---

## 📂 Project Structure
project-root/
├── backend/ # Spring Boot app
│ ├── src/
│ ├── Dockerfile
│ └── application.properties
├── frontend/ # React app
│ ├── src/
│ ├── public/
│ └── Dockerfile
├── docker-compose.yml # Run entire stack
└── README.md

---
## 📃 License
This project is under the MIT License.

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Docker & Docker Compose installed
- Java 17+
- Node.js (for frontend)
- PostgreSQL (Neon/Railway or Docker)

### To run with Docker:

bash
Copy
Edit
docker-compose up --build 
### 💻 Frontend Setup
bash
Copy
Edit
cd frontend
npm install
npm run dev

### 📦 Backend Setup

bash
cd backend
./mvnw clean install



