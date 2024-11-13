// App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from '@/store/authStores';
import AuthLayout from './components/AuthLayout';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Inbox from "./pages/Inbox"
import CreateTemplate from "./pages/CreateTemplate"
import Templates from "./pages/Templates"

const App: React.FC = () => {
  const { isAuthenticated, checkAuth } = useAuthStore();
  useEffect(() => {
    checkAuth(); // Check auth status on app load
  }, [checkAuth]);

  return (
    <Router> {/* This is the single, top-level Router */}
      <Routes>
        {/* Redirect from "/" to "/login" if not authenticated */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        {/* Authentication Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Main App Routes */}
        <Route
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/templates/" element={<Templates />} />

          <Route path="/templates/create" element={<CreateTemplate />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
