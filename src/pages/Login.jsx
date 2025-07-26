import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../supabase.js';
import { useAuth } from '../providers/AuthProvider.jsx';
import { Navigate } from 'react-router-dom';

export default function Login() {
  const { session } = useAuth();
  // Redirect authenticated users to the dashboard
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
      />
    </div>
  );
}