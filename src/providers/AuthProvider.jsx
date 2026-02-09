// src/context/AuthProvider.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { login, logout, getProfile, updateProfile } from "../api.js"; // your api.js exports

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in (on mount / refresh)
// In AuthProvider.jsx, inside useEffect for checkAuth
useEffect(() => {
  const checkAuth = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await getProfile();
      console.log("Profile fetched on mount:", res.data); // debug
      setUser(res.data);
    } catch (err) {
      console.error("Auth check failed:", err);
      localStorage.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  checkAuth();
}, []);
  
  
  // Login function
  const signIn = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await login(email, password);

      // Save tokens
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      // Immediately fetch full profile
      const profileRes = await getProfile();
      setUser(profileRes.data);

      return profileRes.data;
    } catch (err) {
      const message = err.response?.data?.detail || "Login failed. Please check your credentials.";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logOut = async () => {
    setLoading(true);
    try {
      await logout();
    } catch (err) {
      console.warn("Logout request failed:", err);
      // Even if backend logout fails, clear local data
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
      setLoading(false);
    }
  };

  // Update profile (name, photo, etc.)
  const updateUserProfile = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateProfile(data);
      setUser((prev) => ({ ...prev, ...res.data }));
      return res.data;
    } catch (err) {
      const message = err.response?.data?.detail || "Failed to update profile";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    signIn,
    logOut,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};