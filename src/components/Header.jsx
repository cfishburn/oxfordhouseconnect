// src/components/Header.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";   // ← react-router
import { Search, X } from "lucide-react";
import logo from "../assets/oxford-logo.png";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();                       // if you want real routing

  const handleSearch = () => {
    if (!q.trim()) return;
    // 👉 Do whatever search action you need:
    // navigate(`/search?q=${encodeURIComponent(q)}`);
    console.log("Search:", q);
    setOpen(false);
    setQ("");
  };

  return (
    <header className="w-full bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between">
      {/* Spacer to balance flex box */}
      <div className="w-1/3" />

      {/* Logo (clickable) */}
      <div className="w-1/3 flex justify-center">
        <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80">
          <img src={logo} alt="Oxford House Logo" className="h-8" />
          <span className="text-xl font-bold text-gray-900">Oxford House Connect</span>
        </Link>
      </div>

      {/* Search area */}
      <div className="w-1/3 flex justify-end items-center">
        {open ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search…"
              className="border rounded px-2 py-1 w-40 text-sm"
              autoFocus
            />
            <button
              onClick={handleSearch}
              className="p-2 rounded-md hover:bg-gray-100"
              title="Go"
            >
              <Search className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-md hover:bg-gray-100"
              title="Close"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-md hover:bg-gray-100 transition"
            title="Search"
          >
            <Search className="h-5 w-5 text-gray-600" />
          </button>
        )}
      </div>
    </header>
  );
}
