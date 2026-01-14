import { io } from "socket.io-client";

let socket = null;

export const initSocket = () => {
  if (!socket) {
    const socketUrl =
      import.meta.env.VITE_SOCKET_URL ||
      (import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL.replace("/api", "")
        : "http://localhost:5001");

    socket = io(socketUrl, {
      withCredentials: true,
      autoConnect: false,
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  }

  return socket;
};

/**
 * Connect socket
 */
export const connectSocket = () => {
  if (socket && !socket.connected) {
    socket.connect();
  }
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};

/**
 * Register user with socket
 * @param {string} userId - User ID to register
 */
export const registerUser = (userId) => {
  if (socket && socket.connected && userId) {
    socket.emit("register", userId);
    console.log("📝 User registered with socket:", userId);
  }
};

/**
 * Listen for hired notifications
 * @param {Function} callback - Callback function to handle notification
 */
export const onHired = (callback) => {
  if (socket) {
    socket.on("hired", callback);
  }
};

/**
 * Remove hired notification listener
 * @param {Function} callback - Callback function to remove
 */
export const offHired = (callback) => {
  if (socket) {
    socket.off("hired", callback);
  }
};

/**
 * Get socket instance
 */
export const getSocket = () => socket;

export default {
  initSocket,
  connectSocket,
  disconnectSocket,
  registerUser,
  onHired,
  offHired,
  getSocket,
};
