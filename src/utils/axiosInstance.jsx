import axios from "axios";
import { toast } from "react-toastify";

// Base URL for API requests
const API_URL = import.meta.env.VITE_API_URL;

// Create an Axios instance with default configurations
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Create a separate axios instance for refresh token requests
const refreshAxios = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Store the original request URL
    config._requestUrl = config.url;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if it's a 401 error and not a refresh token request
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest._requestUrl !== "/api/auth/refresh-token"
    ) {
      if (isRefreshing) {
        try {
          // Wait for the token to be refreshed
          await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          // Retry the original request with new token
          const retryResponse = await axiosInstance(originalRequest);
          return retryResponse;
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Use the separate axios instance for refresh token request
        const refreshResponse = await refreshAxios.post(
          "/api/auth/refresh-token",
          {},
          {
            withCredentials: true,
          }
        );

        if (refreshResponse.status === 200) {
          // Process all queued requests
          processQueue(null);

          // Retry the original request
          const retryResponse = await axiosInstance({
            ...originalRequest,
            _retry: true,
          });

          return retryResponse;
        }
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Only handle session expiry if refresh token is invalid/expired
        if (refreshError.response?.status === 401) {
          // If refresh fails and we're not already on the login page
          if (!window.location.pathname.includes("/login")) {
            // Clear session storage
            sessionStorage.clear();
            // Show error message
            toast.error("Session expired. Please log in again.");
            // Redirect to login
            window.location.href = "/login";
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    if (error.response) {
      const { status, data } = error.response;

      // Don't show error messages for refresh token failures or if we're already handling a refresh
      if (
        !originalRequest._requestUrl?.includes("/api/auth/refresh-token") &&
        !isRefreshing
      ) {
        if (status === 403) {
          toast.error("You don't have permission to perform this action.");
        } else if (status === 404) {
          toast.error("The requested resource was not found.");
        } else if (status >= 500) {
          toast.error("A server error occurred. Please try again later.");
        } else if (status !== 401) {
          // Don't show error for 401 as it's handled above
          toast.error(data?.message || "An error occurred. Please try again.");
        }
      }
    } else if (error.request) {
      toast.error(
        "No response received from the server. Please check your connection."
      );
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
