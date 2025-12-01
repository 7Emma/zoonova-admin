import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AdminRoute from './components/AdminRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

// Auth Pages
import SetPasswordPage from './pages/SetPasswordPage';
import PasswordResetRequestPage from './pages/PasswordResetRequestPage';
import PasswordResetConfirmPage from './pages/PasswordResetConfirmPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminBooksPage from './pages/admin/AdminBooksPage';
import AdminBookDetailPage from './pages/admin/AdminBookDetailPage';
import AdminBookEditPage from './pages/admin/AdminBookEditPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import AdminMessagesPage from './pages/admin/AdminMessagesPage';
import AdminsManagementPage from './pages/admin/AdminsManagementPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

// Error Pages
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/set-password"
            element={
              <PublicOnlyRoute>
                <SetPasswordPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/password-reset/request"
            element={
              <PublicOnlyRoute>
                <PasswordResetRequestPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/password-reset/confirm"
            element={
              <PublicOnlyRoute>
                <PasswordResetConfirmPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <PublicOnlyRoute>
                <ResetPasswordPage />
              </PublicOnlyRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/books"
            element={
              <AdminRoute>
                <AdminBooksPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/books/:id"
            element={
              <AdminRoute>
                <AdminBookDetailPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/books/new"
            element={
              <AdminRoute>
                <AdminBookEditPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/books/:id/edit"
            element={
              <AdminRoute>
                <AdminBookEditPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrdersPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <AdminRoute>
                <AdminPaymentsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/messages"
            element={
              <AdminRoute>
                <AdminMessagesPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/admins"
            element={
              <AdminRoute isSuperUser>
                <AdminsManagementPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminRoute isSuperUser>
                <AdminSettingsPage />
              </AdminRoute>
            }
          />

          {/* 404 - Must be last */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
