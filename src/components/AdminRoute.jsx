import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from './LoadingSpinner';

export default function AdminRoute({ children, isSuperUser = false }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Vérifie si admin/staff
  if (!user?.is_staff && !user?.is_superuser) {
    return <Navigate to="/" replace />;
  }

  // Vérifie si superuser est requis
  if (isSuperUser && !user?.is_superuser) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
