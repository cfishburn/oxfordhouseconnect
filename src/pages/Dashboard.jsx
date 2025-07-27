import React from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import Sidebar from '../components/Sidebar.jsx';

export default function Dashboard() {
  const session = useSession();
  const email = session?.user?.email || 'Unknown user';

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-grow p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome back!</h1>
        <p className="text-sm text-gray-600">
          Signed in as <span className="font-medium text-blue-700">{email}</span>
        </p>
        {/* You can add dashboard widgets or status blocks here */}
      </main>
    </div>
  );
}
