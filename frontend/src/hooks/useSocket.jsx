import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  initSocket,
  connectSocket,
  disconnectSocket,
  registerUser,
  onHired,
  offHired,
} from "../socket/socketManager";
import toast from "react-hot-toast";

const useSocket = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      initSocket();
      connectSocket();
      registerUser(user.id);

      const handleHired = (notification) => {
        console.log("📢 Hired notification received:", notification);

        toast.success(`🎉 Congratulations! ${notification.message}`, {
          duration: 6000,
          position: "top-center",
          style: { background: "#10b981", color: "white" },
        });

        try {
          const audio = new Audio("/notification.mp3");
          audio.play().catch(() => {});
        } catch (err) {}
      };

      onHired(handleHired);

      return () => {
        offHired(handleHired);
        disconnectSocket();
      };
    } else {
      disconnectSocket();
    }
  }, [isAuthenticated, user]);
};

export default useSocket;
