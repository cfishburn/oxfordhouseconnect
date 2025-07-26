import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider.jsx';

export default function RequireAuth({ children }) {
  const { session } = useAuth();
  const location = useLocation();
  if (!session) {
    // If not authenticated, redirect to login. Preserve the current location so
    // the user can be redirected back after login if needed.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}