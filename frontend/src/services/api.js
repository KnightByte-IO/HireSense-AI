/**
 * services/api.js
 *
 * Kyu exist karta hai?
 * - Saari backend API calls ek jagah se hongi
 * - Axios instance reusable hai - har file me baseURL repeat nahi karna padega
 * - JWT token automatically har request ke header me lag jayega
 */

import axios from "axios";

// .env se backend URL lo (Vite me VITE_ prefix zaroori hai)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Axios instance banao - base settings yahan set hoti hain
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - har API call se pehle token header me daalo
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Agar token hai to Authorization header me bhejo
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - errors ko readable format me lao
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error - server reach nahi ho raha
    if (!error.response) {
      return Promise.reject({
        message: "Server se connect nahi ho pa raha. Backend chal raha hai?",
      });
    }

    // Backend ne error message bheja hai
    const message =
      error.response.data?.message || "Kuch galat ho gaya. Dobara try karo.";

    return Promise.reject({ message, status: error.response.status });
  }
);

// --- Auth API functions ---

export const registerUser = async (userData) => {
  const response = await api.post("/api/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/api/auth/login", credentials);
  return response.data;
};

// --- Resume API functions ---

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await api.post("/api/resume/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getMyResume = async () => {
  const response = await api.get("/api/resume/me");
  return response.data;
};

export const getResumeSummary = async () => {
  const response = await api.get("/api/resume/me/summary");
  return response.data;
};

export default api;
