import { Server } from "socket.io";

let io;
const userSockets = new Map(); // Map of userId -> socketId

/**
 * Initialize Socket.io with the HTTP server
 * @param {object} server - HTTP server instance
 * @param {object} corsOptions - CORS configuration
 */
export const initializeSocket = (server, corsOptions) => {
  io = new Server(server, {
    cors: corsOptions,
  });

  io.on("connection", (socket) => {
    console.log(`🔌 New socket connection: ${socket.id}`);

    // Handle user registration
    socket.on("register", (userId) => {
      if (userId) {
        userSockets.set(userId, socket.id);
        console.log(`✅ User ${userId} registered with socket ${socket.id}`);
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      // Remove user from map
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          console.log(`❌ User ${userId} disconnected`);
          break;
        }
      }
    });
  });

  return io;
};

/**
 * Get Socket.io instance
 * @returns {object} Socket.io instance
 */
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

/**
 * Send notification to a specific user
 * @param {string} userId - Target user ID
 * @param {string} event - Event name
 * @param {object} data - Notification data
 */
export const notifyUser = (userId, event, data) => {
  const socketId = userSockets.get(userId);

  if (socketId && io) {
    io.to(socketId).emit(event, data);
    console.log(`📢 Notification sent to user ${userId}: ${event}`);
    return true;
  }

  console.log(`⚠️  User ${userId} not connected`);
  return false;
};

/**
 * Notify a freelancer when they are hired
 * @param {string} freelancerId - Freelancer user ID
 * @param {object} gigData - Gig information
 */
export const notifyHired = (freelancerId, gigData) => {
  const notification = {
    type: "hired",
    message: `You have been hired for "${gigData.title}"`,
    gigId: gigData._id,
    gigTitle: gigData.title,
    timestamp: new Date(),
  };

  return notifyUser(freelancerId, "hired", notification);
};

/**
 * Broadcast to all connected clients
 * @param {string} event - Event name
 * @param {object} data - Broadcast data
 */
export const broadcast = (event, data) => {
  if (io) {
    io.emit(event, data);
    console.log(`📡 Broadcast sent: ${event}`);
  }
};
