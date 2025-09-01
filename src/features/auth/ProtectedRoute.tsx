// src/components/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Check if user is authenticated
  // This is just an example - replace with your actual auth logic
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    // Add more sophisticated auth checking here
    return !!token;
  };

  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;