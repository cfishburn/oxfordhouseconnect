import React, { useState } from 'react';
import { Search } from 'lucide-react';
import logo from '../assets/oxford-logo.png';

export default function Header({ onSearch }) {
  const [searchVisible, setSearchVisible] = useState(false);
  const [query, setQuery] = useState('');

  const handleToggle = () => {
    setSearchVisible((prev) => !prev);
    setQuery('');
    onSearch(''); // reset search on toggle
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // send search query up
  };

  return (
    <header className="w-full bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between">
      <div className="w-1/3" />

      <div className="w-1/3 flex justify-center">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Oxford House Logo" className="h-8" />
          <span className="text-xl font-bold text-gray-900">Oxford House Connect</span>
        </div>
      </div>

      <div className="w-1/3 flex justify-end items-center gap-2">
        {searchVisible && (
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search..."
            className="border rounded-md px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          />
        )}
        <button
          onClick={handleToggle}
          className="p-2 rounded-md hover:bg-gray-100 transition"
          title="Search"
        >
          <Search className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </header>
  );
}
