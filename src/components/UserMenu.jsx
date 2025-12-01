import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-primary hover:bg-gray-50 transition"
      >
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
          {user.first_name?.[0]?.toUpperCase()}
        </div>
        <span className="hidden sm:inline text-sm font-medium text-gray-900">
          {user.first_name}
        </span>
        <svg
          className={`w-4 h-4 text-gray-600 transition ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>

      {/* Menu Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-900">{user.first_name} {user.last_name}</p>
            <p className="text-xs text-gray-600">{user.email}</p>
            {user.is_superuser && (
              <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                Superuser
              </span>
            )}
          </div>

          <div className="py-2">
            <Link
              to="/admin/settings"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              Paramètres du compte
            </Link>

            {user.is_superuser && (
              <Link
                to="/admin/admins"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                Gestion des administrateurs
              </Link>
            )}
          </div>

          <div className="border-t border-gray-200 py-2">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
            >
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
