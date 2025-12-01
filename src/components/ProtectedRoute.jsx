import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children, requiredRole = null, requiredStaff = false }) {
  const { isAuthenticated, userRole, loading, user } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Vérifie si admin/staff est requis
  if ((requiredRole === 'staff' || requiredStaff) && !user?.is_staff && !user?.is_superuser) {
    return <Navigate to="/" replace />;
  }

  // Vérifie le rôle spécifique
  if (requiredRole && requiredRole !== 'staff' && userRole !== requiredRole && userRole !== 'staff') {
    return <Navigate to="/" replace />;
  }

  return children;
}
