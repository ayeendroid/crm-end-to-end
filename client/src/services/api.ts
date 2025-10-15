import axios, { AxiosError, AxiosInstance } from "axios";
import toast from "react-hot-toast";

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: (import.meta as any).env.VITE_API_URL || "http://localhost:3000/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token to requests
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

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<any>) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;

      switch (status) {
        case 400:
          // Validation errors
          if (data.error?.details) {
            const messages = data.error.details
              .map((d: any) => d.message)
              .join(", ");
            toast.error(messages);
          } else {
            toast.error(data.error?.message || "Bad request");
          }
          break;

        case 401:
          // Unauthorized - clear token and redirect to login
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
          break;

        case 403:
          toast.error("You don't have permission to perform this action");
          break;

        case 404:
          toast.error(data.error?.message || "Resource not found");
          break;

        case 429:
          toast.error("Too many requests. Please try again later.");
          break;

        case 500:
          toast.error("Server error. Please try again later.");
          break;

        default:
          toast.error(data.error?.message || "An unexpected error occurred");
      }
    } else if (error.request) {
      // Request made but no response received
      toast.error("Network error. Please check your connection.");
    } else {
      // Something else happened
      toast.error("An unexpected error occurred");
    }

    return Promise.reject(error);
  }
);

// API response wrapper type
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: any[];
  };
  message?: string;
}

export default api;
