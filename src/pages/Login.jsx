import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../supabase';
import { useAuth } from '../providers/AuthProvider';
import { Navigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // ✅ make sure the filename matches your image

export default function Login() {
  const { session } = useAuth();

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <img src={logo} alt="Oxford House Logo" className="w-24 h-24 mb-6" />
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Username',
              },
              sign_up: {
                email_label: 'Username',
              },
            },
          }}
        />
      </div>
    </div>
  );
}
