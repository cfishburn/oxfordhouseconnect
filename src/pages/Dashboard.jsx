import React from 'react';
import { useAuth } from '../providers/AuthProvider.jsx';
import { supabase } from '../supabase.js';

export default function Dashboard() {
  const { session } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 rounded bg-secondary text-white hover:bg-primary"
        >
          Sign Out
        </button>
      </div>
      <p>Welcome, {session?.user?.email}</p>
      {/* Placeholder for future role‑based cards and content */}
    </div>
  );
}