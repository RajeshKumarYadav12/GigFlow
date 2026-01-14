# GigFlow - Mini Freelance Marketplace 🚀

A full-stack freelance marketplace platform where users can post jobs (Gigs) and apply for them (Bids). Built with modern web technologies for production-ready deployment.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Key Implementation Details](#key-implementation-details)
- [Database Schema](#database-schema)
- [Screenshots](#screenshots)

## ✨ Features

### Core Features

- ✅ **User Authentication** - Secure JWT-based authentication with HttpOnly cookies
- ✅ **Gig Management (CRUD)** - Create, read, update, and delete gigs
- ✅ **Advanced Search** - Full-text search for gigs by title and description
- ✅ **Bidding System** - Submit bids on gigs with proposed pricing
- ✅ **Atomic Hiring Logic** - MongoDB transactions ensure only one freelancer can be hired
- ✅ **Real-time Notifications** - Socket.io powered instant notifications when hired

### Security Features

- 🔒 Password hashing with bcrypt (10 salt rounds)
- 🔒 JWT stored in HttpOnly cookies (prevents XSS attacks)
- 🔒 CORS configuration for secure cross-origin requests
- 🔒 Input validation and sanitization
- 🔒 Protected routes with authentication middleware

### Business Logic

- Fluid roles - Any user can act as Client or Freelancer
- Prevent duplicate bids from same freelancer
- Prevent gig owner from bidding on their own gig
- Only gig owner can view bids and hire
- Automatic rejection of all other bids when one is hired
- Gig status changes from "open" to "assigned" atomically

## 🛠 Tech Stack

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken) + bcrypt
- **Real-time:** Socket.io
- **Validation:** express-validator

### Frontend

- **Framework:** React.js 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** Redux Toolkit
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **Real-time:** Socket.io Client
- **Notifications:** React Hot Toast

## 📁 Project Structure

```
gigflow/
├── backend/
│   ├── controllers/
│   │   ├── authController.js      # Authentication logic
│   │   ├── bidController.js       # Bid management + atomic hiring
│   │   └── gigController.js       # Gig CRUD operations
│   ├── models/
│   │   ├── User.js                # User schema with password hashing
│   │   ├── Gig.js                 # Gig schema with text search index
│   │   └── Bid.js                 # Bid schema with unique constraint
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bidRoutes.js
│   │   └── gigRoutes.js
│   ├── middlewares/
│   │   ├── auth.js                # JWT verification middleware
│   │   └── errorHandler.js       # Global error handling
│   ├── sockets/
│   │   └── socketHandler.js      # Socket.io configuration
│   ├── config/
│   │   └── database.js           # MongoDB connection
│   ├── utils/
│   │   └── jwt.js                # JWT utilities
│   ├── app.js                    # Express app configuration
│   ├── server.js                 # Server entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── GigCard.jsx
    │   │   └── PrivateRoute.jsx
    │   ├── pages/
    │   │   ├── Home.jsx           # Browse all gigs
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── CreateGig.jsx
    │   │   ├── GigDetails.jsx     # View gig, submit bid, hire
    │   │   ├── MyGigs.jsx
    │   │   └── MyBids.jsx
    │   ├── redux/
    │   │   ├── store.js
    │   │   ├── authSlice.js
    │   │   ├── gigsSlice.js
    │   │   └── bidsSlice.js
    │   ├── services/
    │   │   ├── authService.js
    │   │   ├── gigService.js
    │   │   └── bidService.js
    │   ├── socket/
    │   │   └── socketManager.js   # Socket.io client setup
    │   ├── hooks/
    │   │   └── useSocket.js       # Socket connection hook
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
  - Or use MongoDB Atlas (cloud database)
- **npm** or **yarn** package manager

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Task14
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## 🔐 Environment Variables

### Backend Configuration

Create a `.env` file in the `backend` directory:

```bash
cd backend
copy .env.example .env
```

Edit the `.env` file with your configuration:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/gigflow

# JWT Secret Key (use a strong random string in production)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# JWT Cookie Expiry (in days)
JWT_COOKIE_EXPIRE=7
```

**Important Notes:**

- For MongoDB Atlas, use: `mongodb+srv://<username>:<password>@cluster.mongodb.net/gigflow`
- Generate a strong JWT secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- In production, set `NODE_ENV=production`

### Frontend Configuration (Optional)

If using a different backend URL, create `.env` in `frontend`:

```env
VITE_SOCKET_URL=http://localhost:5000
```

## ▶️ Running the Application

### Option 1: Run Both Servers Separately

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

### Option 2: Production Build

**Backend:**

```bash
cd backend
npm start
```

**Frontend:**

```bash
cd frontend
npm run build
npm run preview
```

### Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint             | Description       | Auth Required |
| ------ | -------------------- | ----------------- | ------------- |
| POST   | `/api/auth/register` | Register new user | No            |
| POST   | `/api/auth/login`    | Login user        | No            |
| POST   | `/api/auth/logout`   | Logout user       | Yes           |
| GET    | `/api/auth/me`       | Get current user  | Yes           |

### Gig Endpoints

| Method | Endpoint              | Description                          | Auth Required |
| ------ | --------------------- | ------------------------------------ | ------------- |
| GET    | `/api/gigs`           | Get all open gigs (search supported) | No            |
| GET    | `/api/gigs/:id`       | Get single gig by ID                 | No            |
| POST   | `/api/gigs`           | Create a new gig                     | Yes           |
| GET    | `/api/gigs/my/posted` | Get my posted gigs                   | Yes           |
| PUT    | `/api/gigs/:id`       | Update a gig                         | Yes (Owner)   |
| DELETE | `/api/gigs/:id`       | Delete a gig                         | Yes (Owner)   |

### Bid Endpoints

| Method | Endpoint                 | Description                    | Auth Required |
| ------ | ------------------------ | ------------------------------ | ------------- |
| POST   | `/api/bids`              | Submit a bid                   | Yes           |
| GET    | `/api/bids/:gigId`       | Get bids for a gig             | Yes (Owner)   |
| GET    | `/api/bids/my/submitted` | Get my submitted bids          | Yes           |
| PATCH  | `/api/bids/:bidId/hire`  | **Hire a freelancer (Atomic)** | Yes (Owner)   |

### Request/Response Examples

**Register User:**

```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: 201
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Create Gig:**

```json
POST /api/gigs
{
  "title": "Build a React Website",
  "description": "Need a modern React website with Tailwind CSS",
  "budget": 500
}

Response: 201
{
  "success": true,
  "message": "Gig created successfully",
  "gig": { ... }
}
```

**Submit Bid:**

```json
POST /api/bids
{
  "gigId": "65abc...",
  "message": "I have 5 years of React experience",
  "proposedPrice": 450
}

Response: 201
{
  "success": true,
  "message": "Bid submitted successfully",
  "bid": { ... }
}
```

**Hire Freelancer (Atomic Transaction):**

```json
PATCH /api/bids/65xyz.../hire

Response: 200
{
  "success": true,
  "message": "Freelancer hired successfully",
  "bid": { ... }
}
```

## 🔑 Key Implementation Details

### 1. Atomic Hiring with MongoDB Transactions

The hiring process uses MongoDB transactions to ensure data consistency:

```javascript
// From bidController.js
const session = await mongoose.startSession();
session.startTransaction();

// 1. Update selected bid to 'hired'
await Bid.findByIdAndUpdate(bidId, { status: "hired" }, { session });

// 2. Reject all other bids atomically
await Bid.updateMany(
  { gigId: gig._id, _id: { $ne: bidId } },
  { status: "rejected" },
  { session }
);

// 3. Update gig status to 'assigned'
await Gig.findByIdAndUpdate(
  gig._id,
  { status: "assigned", hiredFreelancerId: freelancerId },
  { session }
);

await session.commitTransaction();
```

**Benefits:**

- **Atomicity:** All operations succeed or all fail
- **Consistency:** No partial updates
- **Race Condition Prevention:** Only one hire can succeed
- **Isolation:** Concurrent requests don't interfere

### 2. Real-time Notifications

Socket.io implementation for instant hiring notifications:

**Backend:**

```javascript
// Notify hired freelancer
notifyHired(freelancerId, { _id: gigId, title: gigTitle });
```

**Frontend:**

```javascript
// Listen for notifications
socket.on("hired", (notification) => {
  toast.success(`You have been hired for "${notification.gigTitle}"`);
});
```

### 3. Security Best Practices

- **Password Security:** Bcrypt with 10 salt rounds
- **JWT Security:** HttpOnly cookies prevent XSS attacks
- **CORS Configuration:** Restricts origins in production
- **Input Validation:** Mongoose schema validation + custom checks
- **Error Handling:** Centralized error handler with detailed logging

### 4. Search Functionality

MongoDB text search index on gig title and description:

```javascript
// Schema definition
gigSchema.index({ title: "text", description: "text" });

// Search query
Gig.find({ $text: { $search: searchTerm } }).sort({
  score: { $meta: "textScore" },
});
```

## 📊 Database Schema

### User Schema

```javascript
{
  name: String (required, max 50 chars),
  email: String (required, unique, lowercase),
  password: String (required, min 6 chars, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Gig Schema

```javascript
{
  title: String (required, max 100 chars),
  description: String (required, max 1000 chars),
  budget: Number (required, min 0),
  ownerId: ObjectId (ref: User),
  status: Enum ['open', 'assigned'] (default: 'open'),
  hiredFreelancerId: ObjectId (ref: User, nullable),
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- { status: 1, createdAt: -1 }
- { ownerId: 1 }
- { title: 'text', description: 'text' }
```

### Bid Schema

```javascript
{
  gigId: ObjectId (ref: Gig),
  freelancerId: ObjectId (ref: User),
  message: String (required, max 500 chars),
  proposedPrice: Number (required, min 0),
  status: Enum ['pending', 'hired', 'rejected'] (default: 'pending'),
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- { gigId: 1, freelancerId: 1 } (unique composite)
- { gigId: 1, status: 1 }
- { freelancerId: 1 }
```

## 🎯 Testing the Application

### Test Flow

1. **Register Two Users:**

   - User A (Client)
   - User B (Freelancer)

2. **User A Creates a Gig:**

   - Navigate to "Post a Gig"
   - Fill in details and submit

3. **User B Submits a Bid:**

   - Browse gigs on home page
   - Click "View Details"
   - Submit a bid with message and price

4. **User A Hires User B:**

   - Go to "My Gigs"
   - View gig details
   - See bids and click "Hire This Freelancer"
   - User B receives real-time notification! 🎉

5. **Verify Atomic Behavior:**
   - Check that gig status changed to "assigned"
   - Other bids (if any) automatically rejected
   - Only one freelancer can be hired

## 🚨 Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB service (Windows)
net start MongoDB

# Start MongoDB service (Mac/Linux)
sudo systemctl start mongod
```

### Port Already in Use

```bash
# Kill process on port 5000 (Backend)
npx kill-port 5000

# Kill process on port 5173 (Frontend)
npx kill-port 5173
```

### Socket.io Connection Failed

- Ensure backend server is running
- Check CORS configuration in backend
- Verify frontend is using correct socket URL

## 📝 License

This project is created for educational purposes as part of an internship assignment.

## 👨‍💻 Author

Full Stack Developer - GigFlow Platform

---

**Built with ❤️ using MERN Stack + Socket.io**
#   G i g F l o w  
 