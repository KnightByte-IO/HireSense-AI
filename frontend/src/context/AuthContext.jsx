/**
 * context/AuthContext.jsx
 *
 * Kyu exist karta hai?
 * - Login state poore app me share hoti hai (user, token, logout)
 * - Har page par alag-alag localStorage check karne ki zaroorat nahi
 * - React Context = global state for authentication
 */

import { createContext, useContext, useState, useEffect } from "react";

// Context create karo - default null
const AuthContext = createContext(null);

// Custom hook - kisi bhi component se auth data access karne ke liye
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Page refresh par check karne ke liye

  // App load hone par localStorage se user restore karo
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  // Login successful hone par call hoga
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);

    // Browser refresh ke baad bhi login rahe isliye save karo
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout - saari auth data clear karo
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Context ke through ye values sab components ko milengi
  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
