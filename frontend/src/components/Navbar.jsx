import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, MessageSquare, PlusCircle, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
              Lost & Found Hub
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/create-post" className="flex items-center text-teal-400 hover:text-teal-300 transition-colors">
                  <PlusCircle className="h-5 w-5 mr-1" />
                  <span className="hidden sm:inline">Create Post</span>
                </Link>
                <Link to="/messages" className="flex items-center text-slate-300 hover:text-white transition-colors">
                  <MessageSquare className="h-5 w-5 mr-1" />
                  <span className="hidden sm:inline">Messages</span>
                </Link>
                <div className="flex items-center text-gray-300">
                  <UserIcon className="h-5 w-5 mr-1" />
                  <span className="hidden sm:inline">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-red-400 hover:text-red-300 transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
                <Link to="/register" className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md transition-colors">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
