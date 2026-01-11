import axios from "axios";

/**
 * Centralized axios instance with baseURL from environment or defaults to localhost:5151.
 * This ensures all API calls use the correct backend URL, especially in dev/prod environments.
 */

// Read API URL from environment variables (Vite uses import.meta.env)
// VITE_API_URL can be set in .env or .env.local
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5151";

// Create a shared axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 (clear token on unauthorized)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid; clear storage
      localStorage.removeItem("token");
      // Optionally redirect to login here if needed
    }
    return Promise.reject(error);
  }
);

export default api;
