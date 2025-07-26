import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import RequireAuth from './components/RequireAuth.jsx';

export default function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Protected route */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />

      {/* Catch-all: redirect anything else (including “/”) to /login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
