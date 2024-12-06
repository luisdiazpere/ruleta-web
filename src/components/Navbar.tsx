import React from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-purple-600">Roulette App</span>
          </div>
          
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-700">Welcome, {user.username}</span>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800"
                >
                  <LogOut size={20} /> Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:text-purple-800"
              >
                <LogIn size={20} /> Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};