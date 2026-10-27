// ProtectedRoute Component
// Restricts access based on authentication status and user roles
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Not logged in -> redirect to login page
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required, check authorization
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on current role
    if (user.role === 'student') {
      return <Navigate to="/student/courses" replace />;
    } else {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return children;
}
