import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useState, useEffect, useRef } from "react";
import { FaUser, FaEdit, FaTachometerAlt, FaSignOutAlt, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ user }) {
  const [profileImage, setProfileImage] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Load profile image from localStorage when user changes
    if (user?.uid) {
      const savedImage = localStorage.getItem(`profile-image-${user.uid}`);
      if (savedImage) {
        setProfileImage(savedImage);
      } else {
        setProfileImage(null);
      }
    } else {
      setProfileImage(null);
    }
  }, [user]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav className="flex justify-between items-center p-4 glass shadow-lg border-b border-primary-800/30 sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold gradient-text relative group">
        SkillSync
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-400 transition-all duration-300 group-hover:w-full"></span>
      </Link>
      <div className="flex items-center space-x-6">
        {user ? (
          <>
            <Link to="/upload" className="text-gray-300 hover:text-primary-400 transition-colors duration-300">Upload</Link>
            <Link to="/ai-resume-maker" className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-500 hover:to-primary-600 transition-all duration-300 shadow-md hover:shadow-primary-500/20">
              Make Resume with AI
            </Link>
            
            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <motion.button 
                onClick={toggleDropdown}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-primary-900/30 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-primary-600/50 hover:border-primary-400 transition-colors duration-300">
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center">
                      <FaUser className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <motion.div
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaChevronDown className="w-3 h-3 text-gray-400" />
                </motion.div>
              </motion.button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-lg rounded-xl border border-primary-800/20 shadow-2xl overflow-hidden z-50"
                  >
                    <div className="py-2">
                      <Link 
                        to="/dashboard" 
                        onClick={closeDropdown}
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-primary-900/40 hover:text-primary-300 transition-colors duration-300"
                      >
                        <FaTachometerAlt className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      
                      <Link 
                        to="/setup-profile" 
                        onClick={closeDropdown}
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-primary-900/40 hover:text-primary-300 transition-colors duration-300"
                      >
                        <FaEdit className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </Link>
                      
                      <div className="border-t border-primary-800/20 my-2"></div>
                      
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-red-900/40 hover:text-red-400 transition-colors duration-300"
                      >
                        <FaSignOutAlt className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-300 hover:text-primary-400 transition-colors duration-300">Login</Link>
            <Link to="/register" className="px-4 py-1 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-all duration-300 shadow-md hover:shadow-primary-500/20">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
