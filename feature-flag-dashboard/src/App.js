import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext.js";
import LoginPage from "./components/pages/LoginPage.jsx";
import RegisterPage from "./components/pages/RegisterPage.jsx";

import ProtectedRoute from "./ProtectedRoute.js";

import Dashboard from "./Dashboard.js";

import Users from "./components/pages/Users.jsx";
import AuditLog from "./components/pages/AuditLog.jsx";
import Settings from "./components/pages/Settings.jsx";

import "./App.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Dashboard */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Additional Pages */}
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />

          <Route
            path="/audit"
            element={
              <ProtectedRoute>
                <AuditLog />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
