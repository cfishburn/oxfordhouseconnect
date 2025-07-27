import React from 'react';
import { Search } from 'lucide-react'; // icon library
import logo from '../assets/oxford-logo.png';

export default function Header() {
  return (
    <header className="w-full bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between">
      {/* Left: Spacer to balance */}
      <div className="w-1/3" />

      {/* Center: Logo */}
      <div className="w-1/3 flex justify-center">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Oxford House Logo" className="h-8" />
          <span className="text-xl font-bold text-gray-900">Oxford House Connect</span>
        </div>
      </div>

      {/* Right: Search icon */}
      <div className="w-1/3 flex justify-end items-center">
        <button
          className="p-2 rounded-md hover:bg-gray-100 transition"
          title="Search"
        >
          <Search className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </header>
  );
}
