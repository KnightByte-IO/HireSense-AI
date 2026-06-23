/**
 * components/ProtectedRoute.jsx
 *
 * Kyu exist karta hai?
 * - Dashboard jaisi private pages ko protect karta hai
 * - Bina login ke koi dashboard na khole - login page par bhej dega
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Auth check ho raha hai - blank screen dikhao (flicker avoid)
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-900">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  // Login nahi hai to /login par redirect
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Login hai to child page (Dashboard) dikhao
  return children;
};

export default ProtectedRoute;
