import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";
import { checkAuth } from "./redux/authSlice";
import useSocket from "./hooks/useSocket.jsx";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateGig from "./pages/CreateGig";
import GigDetails from "./pages/GigDetails";
import MyGigs from "./pages/MyGigs";
import MyBids from "./pages/MyBids";
import PrivateRoute from "./components/PrivateRoute";
import Footer from "./components/Footer";

function App() {
  const dispatch = useDispatch();

  useSocket();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />

        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/gig/:id" element={<GigDetails />} />
            <Route
              path="/create-gig"
              element={
                <PrivateRoute>
                  <CreateGig />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-gigs"
              element={
                <PrivateRoute>
                  <MyGigs />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-bids"
              element={
                <PrivateRoute>
                  <MyBids />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
