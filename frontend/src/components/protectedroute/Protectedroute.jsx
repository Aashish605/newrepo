// components/protectedroute/Protectedroute.jsx
import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

import axios from "axios";

export default function Protectedroute() {




  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("https://newrepo-backend.vercel.app/check", {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("authentication check response:", response);
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log("authentication fails:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []); // Remove isAuthenticated from dependency array

  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="h-[50vh] w-full flex items-center justify-center text-3xl ">Loading...</div>;
  }

  // Redirect to login if not authenticated
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
