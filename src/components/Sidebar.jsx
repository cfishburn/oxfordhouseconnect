import { Link, useLocation, useNavigate } from 'react-router-dom';
import supabase from '../supabase'; // Use your own supabase.js client
import logo from '../assets/oxford-logo.png';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: '/members', label: 'Members' },
    { to: '/president', label: 'President' },
    { to: '/secretary', label: 'Secretary' },
    { to: '/treasurer', label: 'Treasurer' },
    { to: '/comptroller', label: 'Comptroller' },
    { to: '/coordinator', label: 'Coordinator' },
    { to: '/hsr', label: 'Housing Service Representative' },
    { to: '/documentation', label: 'Documentation' },
  ];

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert('Sign out failed: ' + error.message);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="w-64 h-[calc(100vh-4rem)] flex flex-col justify-between bg-white shadow-md p-4">
      <div>
        <Link to="/dashboard" className="flex items-center gap-2 mb-6">
          <img src={logo} alt="Logo" className="h-6 w-6" />
          <h1 className="font-bold text-blue-700 text-md">Epic Dashboard</h1>
        </Link>
        <ul className="space-y-2">
          {links.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`block px-2 py-1 rounded hover:bg-gray-100 ${
                  location.pathname === to ? 'font-semibold text-blue-700' : ''
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={handleSignOut}
        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
      >
        Sign Out
      </button>
    </div>
  );
}
