import axios from "axios";
import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";

const API_URL = import.meta.env.VITE_API_URL;

// Function to check if the user is authenticated
const isAuthenticated = async () => {
  try {
    // Try to get user data from session storage first
    const userData = sessionStorage.getItem("user");
    if (!userData) {
      return false;
    }

    // Verify with backend - this will trigger token refresh if needed
    const response = await axiosInstance.get("/api/users/me");

    // Update user data in session storage if needed
    if (response.data?.data) {
      sessionStorage.setItem("user", JSON.stringify(response.data.data));
    }

    return response.status === 200;
  } catch (error) {
    // If unauthorized and refresh token failed, clear session
    if (error.response?.status === 401) {
      sessionStorage.clear();
    }
    return false;
  }
};

// Function to log out the user
const logout = async () => {
  try {
    await axiosInstance.post("/api/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Always clear session storage and redirect
    sessionStorage.clear();
    window.location.href = "/login";
  }
};

export { isAuthenticated, logout };
