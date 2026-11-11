import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Leaf, Menu, User, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex items-center justify-between h-16">

          {/* Logo */}

          <Link
            to="/"
            className="flex items-center gap-2"
          >
            <Leaf className="text-green-500" size={30} />

            <span className="text-2xl font-bold text-white">

              FoodRescue

            </span>

          </Link>

          {/* Desktop */}

          <div className="hidden md:flex items-center gap-8">

            <Link
              to="/"
              className={`hover:text-green-400 ${
                location.pathname === "/" ? "text-green-400" : "text-white"
              }`}
            >
              Home
            </Link>

            {!user && (
              <Link
                to="/role-selection"
                className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white font-semibold"
              >
                Get Started
              </Link>
            )}

            {user && (
              <>
                <Link
                  to={`/${user.role}/dashboard`}
                  className="flex items-center gap-2 text-white hover:text-green-400"
                >
                  <LayoutDashboard size={18} />

                  Dashboard
                </Link>

                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-red-400 hover:text-red-500"
                >
                  <LogOut size={18} />

                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile */}

          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            <Menu />
          </button>
        </div>

        {mobileMenu && (
          <div className="md:hidden pb-5 flex flex-col gap-4">

            <Link to="/" className="text-white">
              Home
            </Link>

            {!user && (
              <Link
                to="/role-selection"
                className="bg-green-600 text-center py-2 rounded-lg text-white"
              >
                Get Started
              </Link>
            )}

            {user && (
              <>
                <Link
                  to={`/${user.role}/dashboard`}
                  className="text-white"
                >
                  Dashboard
                </Link>

                <button
                  onClick={logout}
                  className="text-left text-red-400"
                >
                  Logout
                </button>
              </>
            )}

          </div>
        )}

      </div>
    </nav>
  );
}