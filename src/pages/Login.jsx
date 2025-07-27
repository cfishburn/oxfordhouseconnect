import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import supabase from '../supabase.js';
import logo from '../assets/oxford-logo.png';

export default function Login() {
  const session = useSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if user is already logged in
  if (session) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col">
      {/* Header */}
      <header className="w-full shadow-sm bg-white">
        <div className="max-w-7xl mx-auto flex justify-center items-center gap-3 p-4">
          <img src={logo} alt="Oxford House Connection logo" className="h-10 w-10" />
          <span className="text-2xl font-semibold text-blue-800">Oxford House Connection</span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-gray-800">Member Login</h1>
            <p className="text-sm text-gray-500">Welcome to the Oxford House Connection Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="flex items-center justify-between text-xs text-blue-600 mt-2">
              <a href="#" className="hover:underline">Forgot Password?</a>
              <a href="#" className="hover:underline">Register</a>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 py-4">
        © {new Date().getFullYear()} Oxford House Connection Inc.
      </footer>
    </div>
  );
}
