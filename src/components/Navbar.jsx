import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { isAuthenticated, logout } from "../utils/auth";
import LogoutModal from "./LogoutModal"; // Import the LogoutModal component

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track authentication status
  const navigate = useNavigate();
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await isAuthenticated();
      setIsLoggedIn(authStatus); // Update state with authentication status
    };

    checkAuth();
  }, []); // Run only once on component mount

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle Logout
  const handleLogout = () => {
    logout(); // Clear accessToken and log out the user
    setIsLoggedIn(false); // Update state to reflect logged-out status
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="bg-indigo-600 shadow-md w-full fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-white text-xl font-bold">
              Progress Tracker
            </Link>
          </div>

          {/* Navigation Links (Desktop View) */}
          <div className="hidden md:flex space-x-4">
            {isLoggedIn ? (
              <>
                <Link
                  to="/activities"
                  className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105"
                >
                  Activities
                </Link>
                <Link
                  to="/history"
                  className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105"
                >
                  History
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105"
                >
                  Home
                </Link>
                <Link
                  to="/register"
                  className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Right aligned Profile icon */}
          <div className="flex items-center space-x-1 md:space-x-4">
            {/* Profile Icon */}
            {isLoggedIn && (
              <Link
                to="/profile"
                className="text-white hover:bg-indigo-700 p-2 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>
            )}

            {/* Logout Modal (Shown only on medium and large screens) */}
            {isLoggedIn && (
              <div className="hidden md:block">
                <LogoutModal onLogout={handleLogout} />
              </div>
            )}

            {/* Burger Menu Button */}
            <div className="md:hidden flex items-center h-16">
              <button
                type="button"
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-indigo-700 focus:outline-none cursor-pointer transition-all duration-300"
                aria-controls="mobile-menu"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <span
                    className={`absolute w-6 h-0.5 bg-white transform transition-all duration-300 ease-in-out ${
                      isMenuOpen ? "rotate-45 translate-y-0" : "-translate-y-2"
                    }`}
                  ></span>
                  <span
                    className={`absolute w-6 h-0.5 bg-white transform transition-all duration-300 ease-in-out ${
                      isMenuOpen ? "opacity-0" : "opacity-100"
                    }`}
                  ></span>
                  <span
                    className={`absolute w-6 h-0.5 bg-white transform transition-all duration-300 ease-in-out ${
                      isMenuOpen ? "-rotate-45 translate-y-0" : "translate-y-2"
                    }`}
                  ></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`transform transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-full pointer-events-none"
        } md:hidden fixed top-16 right-0 h-[calc(100vh-4rem)] ${
          isLoggedIn ? "w-full" : "w-40"
        } bg-indigo-600 shadow-lg border-l border-indigo-700`}
      >
        <div
          className={`px-4 pt-4 pb-6 h-full overflow-y-auto ${
            isLoggedIn ? "max-w-md mx-auto w-full" : ""
          }`}
        >
          {isLoggedIn ? (
            <div className="space-y-4">
              <div className="bg-indigo-700/50 rounded-lg p-4 backdrop-blur-sm">
                <Link
                  to="/activities"
                  className="flex items-center justify-center space-x-3 text-white hover:bg-indigo-500 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 transform hover:scale-105 hover:translate-x-2 hover:shadow-md group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-indigo-200 group-hover:text-white transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <span>Activities</span>
                </Link>

                <Link
                  to="/history"
                  className="flex items-center justify-center space-x-3 text-white hover:bg-indigo-500 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 transform hover:scale-105 hover:translate-x-2 hover:shadow-md group mt-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-indigo-200 group-hover:text-white transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>History</span>
                </Link>
              </div>

              <div className="bg-indigo-700/50 rounded-lg p-4 backdrop-blur-sm">
                <div className="mt-2">
                  <LogoutModal onLogout={handleLogout} isMobile={true} />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Link
                to="/"
                className="block text-white hover:bg-indigo-500 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 transform hover:scale-105 hover:translate-x-2 hover:shadow-md"
              >
                <div className="flex items-center space-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span>Home</span>
                </div>
              </Link>

              <Link
                to="/register"
                className="block text-white hover:bg-indigo-500 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 transform hover:scale-105 hover:translate-x-2 hover:shadow-md"
              >
                <div className="flex items-center space-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  <span>Register</span>
                </div>
              </Link>

              <Link
                to="/login"
                className="block text-white hover:bg-indigo-500 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 transform hover:scale-105 hover:translate-x-2 hover:shadow-md"
              >
                <div className="flex items-center space-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Login</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
