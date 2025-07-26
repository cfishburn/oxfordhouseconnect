import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabase.js';
import { useAuth } from '../providers/AuthProvider.jsx';
import logo from '../assets/oxford-logo.png'; /Users/christopherfishburn/Downloads/oxford-logo.png

export default function Login() {
  /* auth redirect */
  const { session } = useAuth();
  if (session) return <Navigate to="/dashboard" replace />;

  /* local form state */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  /* submit handler */
  async function handleSubmit(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col">
      {/* Top nav / branding */}
      <header className="w-full shadow-sm bg-white">
        <div className="max-w-7xl mx-auto flex items-center gap-3 p-4">
          <img src={logo} alt="Oxford Houses logo" className="h-10 w-10" />
          <span className="text-xl font-semibold text-blue-800">Oxford Houses</span>
        </div>
      </header>

      {/* Hero + form */}
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-gray-800">
              Member Login
            </h1>
            <p className="text-sm text-gray-500">
              Welcome to the Oxford Houses Portal
            </p>
          </div>

          {/* form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Sign In
            </button>

            <div className="flex items-center justify-between text-xs text-blue-600 mt-2">
              <a href="#" className="hover:underline">Forgot Password?</a>
              <a href="#" className="hover:underline">Register</a>
            </div>
          </form>
        </div>
      </main>

      {/* simple footer */}
      <footer className="text-center text-xs text-gray-400 py-4">
        © {new Date().getFullYear()} Oxford House Inc.
      </footer>
    </div>
  );
}
