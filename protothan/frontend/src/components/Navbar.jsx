import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Leaf, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  const isAdmin = user?.role === 'admin';
  const showDashboard = user && !['home', '/', '/role-selection'].includes(location.pathname);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-green-600 to-blue-600 p-2 rounded-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              FoodRescue
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-green-600 transition font-medium">
              Home
            </Link>
            
            {user ? (
              <>
                {showDashboard && (
                  <Link to={`/${user.role}/dashboard`} className="text-gray-600 hover:text-green-600 transition font-medium flex items-center">
                    <LayoutDashboard className="h-4 w-4 mr-1" />
                    Dashboard
                  </Link>
                )}
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </button>
                  
                  {showMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                      </div>
                      <button
                        onClick={() => { logout(); setShowMenu(false); }}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/role-selection"
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {showMenu && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-3">
            <Link to="/" className="block text-gray-600 hover:text-green-600 font-medium">Home</Link>
            {user ? (
              <>
                <Link to={`/${user.role}/dashboard`} className="block text-gray-600 hover:text-green-600 font-medium">Dashboard</Link>
                <button onClick={() => { logout(); setShowMenu(false); }} className="w-full text-left text-red-600 font-medium">Logout</button>
              </>
            ) : (
              <Link to="/role-selection" className="block px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold text-center">Get Started</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}