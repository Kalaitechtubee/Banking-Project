import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg z-50">
      <div className="container flex items-center justify-between p-4 mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold text-white tracking-tight hover:text-indigo-100 transition-colors duration-200"
        >
          Info Hub
        </Link>

        {/* Hamburger Menu Button (Visible on Mobile) */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          <SignedOut>
            <Link
              to="/sign-up"
              className="px-5 py-2 text-white font-medium bg-transparent border-2 border-white/20 rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-300 backdrop-blur-sm"
            >
              Sign Up
            </Link>
            <Link
              to="/dashboard"
              className="px-5 py-2 text-indigo-600 font-medium bg-white rounded-full hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-300 shadow-md"
            >
              Sign In
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    'w-10 h-10 border-2 border-white/20 hover:border-white/40 transition-all duration-300',
                },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </div>

        {/* Mobile Menu - Visible when toggled */}
        <div
          className={`${
            isOpen ? 'flex' : 'hidden'
          } md:hidden absolute top-16 left-0 w-full bg-gradient-to-r from-indigo-600 to-purple-600 flex-col items-center space-y-4 py-4 shadow-lg`}
        >
          <SignedOut>
            <Link
              to="/sign-up"
              className="px-5 py-2 text-white font-medium bg-transparent border-2 border-white/20 rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-300 backdrop-blur-sm"
              onClick={toggleMenu}
            >
              Sign Up
            </Link>
            <Link
              to="/dashboard"
              className="px-5 py-2 text-indigo-600 font-medium bg-white rounded-full hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-300 shadow-md"
              onClick={toggleMenu}
            >
              Sign In
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    'w-10 h-10 border-2 border-white/20 hover:border-white/40 transition-all duration-300',
                },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;