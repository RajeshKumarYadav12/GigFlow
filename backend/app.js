import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import gigRoutes from "./routes/gigRoutes.js";
import bidRoutes from "./routes/bidRoutes.js";

/**
 * Create and configure Express application
 */
const createApp = () => {
  const app = express();

  // CORS configuration
  const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true, // Allow cookies
    optionsSuccessStatus: 200,
  };

  // Middlewares
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Server is running",
      timestamp: new Date(),
    });
  });

  // Root endpoint
  app.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to GigFlow API",
      version: "1.0.0",
      endpoints: {
        health: "/health",
        auth: "/api/auth",
        gigs: "/api/gigs",
        bids: "/api/bids",
      },
      documentation: "https://github.com/yourusername/gigflow",
    });
  });

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/gigs", gigRoutes);
  app.use("/api/bids", bidRoutes);

  // Error handlers (must be last)
  app.use(notFound);
  app.use(errorHandler);

  return { app, corsOptions };
};

export default createApp;
