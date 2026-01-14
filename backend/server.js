import dotenv from "dotenv";
import http from "http";
import createApp from "./app.js";
import { connectDB } from "./config/database.js";
import { initializeSocket } from "./sockets/socketHandler.js";

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Create Express app
const { app, corsOptions } = createApp();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
initializeSocket(server, corsOptions);

// Server configuration
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Start server
server.listen(PORT, () => {
  console.log(`
    ╔═══════════════════════════════════════════════════╗
    ║                                                   ║
    ║       🚀 GigFlow Server Running                  ║
    ║                                                   ║
    ║       Environment: ${NODE_ENV.padEnd(31)}║
    ║       Port:        ${PORT.toString().padEnd(31)}║
    ║       API:         http://localhost:${PORT.toString().padEnd(18)}║
    ║                                                   ║
    ╚═══════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});
