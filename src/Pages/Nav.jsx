import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, User, Folder, Image, Settings, Menu, X, 
  Camera, Bookmark, Heart, Bell, Search, Sun, Moon,
  ChevronRight, LogOut, UserCircle , Building2
} from 'lucide-react';
import Install from '../Install';

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Navigation links configuration
  const navLinks = [
    { path: '/', name: 'Home', icon: Home, end: true },
    { path: '/about', name: 'About', icon: User },
    { path: '/collections', name: 'Collections', icon: Folder },
    { path: '/projects', name: 'View Projects', icon: Settings },
    { path: '/upload', name: 'uploads', icon: Settings },

    
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Toggle dark mode


  // Active link styling function
  const getLinkClass = ({ isActive }) => {
    return `relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 
      ${isActive 
        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 font-semibold' 
        : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`;
  };

  // Mobile menu item animation
  const mobileItemVariants = {
    closed: { x: -20, opacity: 0 },
    open: (i) => ({
      x: 0,
      opacity: 1,
      transition: { delay: i * 0.05, duration: 0.3 }
    })
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled 
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg' 
          : 'bg-white dark:bg-gray-900 shadow-md'
        }
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <Install/>
            {/* Logo */}
             <span className=" lg:text-xl   ml-6 text-sm font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                CIVINEST builders & developers,LLP. 
              </span>
            <NavLink to="/" className="flex items-center gap-2 group hi">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center"
              >
              <Building2 size={18} className="text-white" />
              </motion.div>
             
            </NavLink>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.end}
                  className={getLinkClass}
                >
                  <link.icon size={18} />
                  <span className="text-sm font-medium">{link.name}</span>
                  {/* Active Indicator */}
                  {({ isActive }) => isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </NavLink>
                
              ))}
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
            >
              <div className="px-4 py-4 space-y-1">
                {/* Mobile Navigation Links */}
                {navLinks.map((link, index) => (
                  <motion.div>
                    <NavLink
                      to={link.path}
                      end={link.end}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                        ${isActive 
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold' 
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      <link.icon size={20} />
                      <span className="text-base font-medium">{link.name}</span>
                      {({ isActive }) => isActive && (
                        <motion.div
                          layoutId="mobileActiveIndicator"
                          className="ml-auto w-1.5 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </NavLink>
                  </motion.div>
                ))}

                <div className="h-px bg-gray-200 dark:bg-gray-800 my-4" />
                

                
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
      </nav>

      {/* Spacer to prevent content from going under navbar */}
      <div className="h-16 md:h-20" />
    </>
  );
};

export default Nav;