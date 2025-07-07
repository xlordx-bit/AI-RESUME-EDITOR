import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FaUser, FaHeart, FaBriefcase, FaEdit, FaFileAlt, FaStar, FaTrophy, FaChartLine, FaCamera, FaUpload } from "react-icons/fa";

export default function Dashboard() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Load profile data from localStorage
    if (user?.uid) {
      const savedProfile = localStorage.getItem(`profile-data-${user.uid}`);
      if (savedProfile) {
        setProfileData(JSON.parse(savedProfile));
      }
      
      // Load profile image from localStorage
      const savedImage = localStorage.getItem(`profile-image-${user.uid}`);
      if (savedImage) {
        setProfileImage(savedImage);
      }
    }
    setLoading(false);
  }, [user]);

  const handleEditProfile = () => {
    navigate("/setup-profile");
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setProfileImage(imageData);
        
        // Save to localStorage
        if (user?.uid) {
          localStorage.setItem(`profile-image-${user.uid}`, imageData);
        }
        
        // Create success toast
        const successToast = document.createElement('div');
        successToast.className = 'fixed top-4 right-4 bg-primary-600 text-white py-3 px-6 rounded-lg shadow-lg flex items-center z-50 transition-opacity duration-300';
        successToast.innerHTML = `
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          Profile picture updated successfully!
        `;
        document.body.appendChild(successToast);
        
        setTimeout(() => {
          successToast.classList.add('opacity-0');
          setTimeout(() => {
            document.body.removeChild(successToast);
          }, 300);
        }, 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading your dashboard...</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center glass p-8 rounded-xl border border-primary-800/30 max-w-md"
        >
          <h2 className="text-2xl font-bold gradient-text mb-4">Complete Your Profile</h2>
          <p className="text-gray-400 mb-6">
            Please complete your profile setup to access your personalized dashboard.
          </p>
          <motion.button
            onClick={() => navigate("/setup-profile")}
            className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-glow font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Setup Profile
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-800 to-dark-950 bg-gradient-animate animate-gradient"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600 rounded-full opacity-10 blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-700 rounded-full opacity-10 blur-[100px] animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative z-10 p-6 lg:p-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={cardVariants} className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold gradient-text mb-2">
                  Welcome back, {profileData.fullName.split(' ')[0]}! 👋
                </h1>
                <p className="text-gray-400 text-lg">
                  Here's your personalized career dashboard
                </p>
              </div>
              <motion.button
                onClick={handleEditProfile}
                className="mt-4 lg:mt-0 flex items-center gap-2 border border-primary-600 text-primary-400 py-2 px-4 rounded-lg hover:bg-primary-900/30 hover:text-primary-300 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaEdit className="w-4 h-4" />
                Edit Profile
              </motion.button>
            </div>
          </motion.div>

          {/* Profile Overview Card */}
          <motion.div variants={cardVariants} className="mb-8">
            <div className="glass rounded-xl p-6 border border-primary-800/30">
              <div className="flex items-start gap-6">
                {/* Profile Picture Section */}
                <div className="relative group">
                  <motion.div 
                    className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary-600/50 cursor-pointer relative"
                    whileHover={{ scale: 1.05 }}
                    onClick={handleImageClick}
                  >
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center">
                        <FaUser className="w-10 h-10 text-white" />
                      </div>
                    )}
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <FaCamera className="w-6 h-6 text-white" />
                    </div>
                  </motion.div>
                  
                  {/* Upload button */}
                  <motion.button
                    onClick={handleImageClick}
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-600 hover:bg-primary-500 rounded-full flex items-center justify-center border-2 border-dark-800 transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaUpload className="w-3 h-3 text-white" />
                  </motion.button>
                  
                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">{profileData.fullName}</h2>
                  <div className="flex items-center gap-2 mb-3">
                    <FaBriefcase className="w-4 h-4 text-primary-400" />
                    <span className="text-primary-300 font-medium">{profileData.currentActivity}</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{profileData.description}</p>
                  
                  {/* Upload hint */}
                  {!profileImage && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 flex items-center gap-2 text-sm text-primary-400/70"
                    >
                      <FaCamera className="w-4 h-4" />
                      <span>Click the avatar to upload your profile picture</span>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div variants={cardVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="glass rounded-xl p-6 border border-primary-800/30 text-center">
              <div className="w-12 h-12 bg-primary-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FaHeart className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{profileData.hobbies.length}</h3>
              <p className="text-gray-400 text-sm">Interests & Hobbies</p>
            </div>
            
            <div className="glass rounded-xl p-6 border border-primary-800/30 text-center">
              <div className="w-12 h-12 bg-primary-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FaStar className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">85%</h3>
              <p className="text-gray-400 text-sm">Profile Completeness</p>
            </div>
            
            <div className="glass rounded-xl p-6 border border-primary-800/30 text-center">
              <div className="w-12 h-12 bg-primary-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FaTrophy className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">0</h3>
              <p className="text-gray-400 text-sm">Resumes Optimized</p>
            </div>
            
            <div className="glass rounded-xl p-6 border border-primary-800/30 text-center">
              <div className="w-12 h-12 bg-primary-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FaChartLine className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">0</h3>
              <p className="text-gray-400 text-sm">Skill Matches</p>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Hobbies & Interests */}
            <motion.div variants={cardVariants} className="lg:col-span-2">
              <div className="glass rounded-xl p-6 border border-primary-800/30">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center">
                    <FaHeart className="w-5 h-5 text-primary-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Your Interests & Hobbies</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {profileData.hobbies.map((hobby, index) => (
                    <motion.span
                      key={hobby}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="inline-block py-2 px-4 rounded-full bg-primary-900/50 text-primary-300 border border-primary-800 text-sm font-medium hover:bg-primary-800/50 transition-colors duration-300"
                    >
                      {hobby}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={cardVariants}>
              <div className="glass rounded-xl p-6 border border-primary-800/30">
                <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <motion.button
                    onClick={() => navigate("/upload")}
                    className="w-full flex items-center gap-3 p-4 rounded-lg bg-primary-600/20 border border-primary-800/50 text-primary-300 hover:bg-primary-600/30 hover:text-primary-200 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaFileAlt className="w-5 h-5" />
                    <span className="font-medium">Upload Resume</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={handleEditProfile}
                    className="w-full flex items-center gap-3 p-4 rounded-lg bg-dark-800/50 border border-primary-800/30 text-gray-300 hover:bg-primary-900/30 hover:text-primary-300 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaEdit className="w-5 h-5" />
                    <span className="font-medium">Update Profile</span>
                  </motion.button>
                  
                  <motion.button
                    className="w-full flex items-center gap-3 p-4 rounded-lg bg-dark-800/50 border border-primary-800/30 text-gray-300 hover:bg-primary-900/30 hover:text-primary-300 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaChartLine className="w-5 h-5" />
                    <span className="font-medium">View Analytics</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <motion.div variants={cardVariants} className="mt-8">
            <div className="glass rounded-xl p-6 border border-primary-800/30">
              <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-primary-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaFileAlt className="w-8 h-8 text-primary-400/50" />
                </div>
                <p className="text-gray-400 mb-4">No recent activity yet</p>
                <motion.button
                  onClick={() => navigate("/upload")}
                  className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white py-2 px-6 rounded-lg transition-all duration-300 hover:shadow-glow font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Upload Your First Resume
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
