import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import MembersPage from './pages/Members.jsx';
import President from './pages/President.jsx';
import Secretary from './pages/Secretary.jsx';
import Treasurer from './pages/Treasurer.jsx';
import Comptroller from './pages/Comptroller.jsx';
import Coordinator from './pages/Coordinator.jsx';
import HSR from './pages/HSR.jsx';
import Documentation from './pages/Documentation.jsx';
import { AuthProvider } from './providers/AuthProvider.jsx';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/president" element={<President />} />
        <Route path="/secretary" element={<Secretary />} />
        <Route path="/treasurer" element={<Treasurer />} />
        <Route path="/comptroller" element={<Comptroller />} />
        <Route path="/coordinator" element={<Coordinator />} />
        <Route path="/hsr" element={<HSR />} />
        <Route path="/documentation" element={<Documentation />} />
      </Routes>
    </AuthProvider>
  );
}
