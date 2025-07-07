import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "../firebase";

export default function SetupProfile({ onComplete }) {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Hobby options for selection
  const hobbyOptions = [
    "Reading", "Writing", "Coding", "Sports", "Photography", 
    "Hiking", "Cooking", "Gaming", "Music", "Travel",
    "Art", "Dancing", "Yoga", "Meditation", "Blogging",
    "Crafts", "Gardening", "Chess", "Cycling", "Swimming",
    "Movies", "Podcasts", "Learning Languages", "Volunteering", "Fitness"
  ];

  // Current activity options
  const currentActivityOptions = [
    "Student", "Recent Graduate", "Job Seeker", "Employed", 
    "Freelancer", "Entrepreneur", "Intern", "Career Changer",
    "Returning to Work", "Consultant", "Part-time Worker"
  ];

  const [profile, setProfile] = useState({
    fullName: user?.displayName || "",
    hobbies: [],
    currentActivity: "",
    description: "",
  });

  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleHobbyToggle = (hobby) => {
    setProfile(prev => ({
      ...prev,
      hobbies: prev.hobbies.includes(hobby)
        ? prev.hobbies.filter(h => h !== hobby)
        : [...prev.hobbies, hobby]
    }));
  };

  const handleActivitySelect = (activity) => {
    setProfile(prev => ({ ...prev, currentActivity: activity }));
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Collected Profile Info:", profile);
    
    // Save to localStorage for dashboard access
    if (user?.uid) {
      localStorage.setItem(`profile-data-${user.uid}`, JSON.stringify(profile));
      // Mark profile as completed
      localStorage.setItem(`profile-completed-${user.uid}`, 'true');
    }
    
    // Call onComplete callback to update parent state
    if (onComplete) {
      onComplete();
    }
    
    // Create a success toast
    const successToast = document.createElement('div');
    successToast.className = 'fixed top-4 right-4 bg-primary-600 text-white py-3 px-6 rounded-lg shadow-lg flex items-center z-50 transition-opacity duration-300';
    successToast.innerHTML = `
      <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
      Profile setup completed successfully!
    `;
    document.body.appendChild(successToast);
    
    setTimeout(() => {
      successToast.classList.add('opacity-0');
      setTimeout(() => {
        document.body.removeChild(successToast);
      }, 300);
    }, 3000);
    
    navigate("/dashboard");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 px-4 py-12 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-800 to-dark-950 bg-gradient-animate animate-gradient"></div>
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary-600 rounded-full opacity-20 blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-primary-700 rounded-full opacity-20 blur-[100px] animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      </div>
      
      <motion.div 
        className="glass rounded-xl shadow-lg p-8 w-full max-w-2xl border border-primary-800/30 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <AnimatePresence mode="wait">
          {/* Step 1: Name Entry */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-bold text-center gradient-text mb-1">
                  Welcome to SkillSync! 👋
                </h2>
                <p className="text-center text-gray-400 mb-6">
                  We're excited to help you supercharge your career.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-6">
                <p className="text-lg font-medium text-primary-300 mb-2">
                  Let's get to know you a bit — what's your full name?
                </p>
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  required
                  className="w-full bg-dark-800 border border-primary-800/30 text-white px-4 py-3 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 text-lg"
                  placeholder="Your full name"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.button
                  type="button"
                  onClick={nextStep}
                  disabled={!profile.fullName}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow font-medium"
                  whileHover={{ scale: profile.fullName ? 1.02 : 1 }}
                  whileTap={{ scale: profile.fullName ? 0.98 : 1 }}
                >
                  Next Step
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 2: Hobbies Selection */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-bold text-center gradient-text mb-1">
                  Awesome, {profile.fullName.split(' ')[0]}! 😎
                </h2>
                <p className="text-center text-gray-400 mb-6">
                  What do you love doing in your free time? (Select multiple)
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-6">
                <p className="text-lg font-medium text-primary-300 mb-4">
                  Choose your hobbies and interests:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                  {hobbyOptions.map((hobby) => (
                    <motion.button
                      key={hobby}
                      type="button"
                      onClick={() => handleHobbyToggle(hobby)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                        profile.hobbies.includes(hobby)
                          ? 'bg-primary-600 text-white border-primary-500'
                          : 'bg-dark-800 text-gray-300 border-primary-800/30 hover:bg-primary-900/30 hover:text-primary-300'
                      } border`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {hobby}
                    </motion.button>
                  ))}
                </div>
                {profile.hobbies.length > 0 && (
                  <p className="text-sm text-primary-400 mt-3">
                    Selected: {profile.hobbies.length} {profile.hobbies.length === 1 ? 'hobby' : 'hobbies'}
                  </p>
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="flex space-x-3">
                <motion.button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="w-1/3 border border-primary-600 text-primary-400 py-3 rounded-lg hover:bg-primary-900/30 hover:text-primary-300 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Back
                </motion.button>
                <motion.button
                  type="button"
                  onClick={nextStep}
                  disabled={profile.hobbies.length === 0}
                  className="w-2/3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow font-medium"
                  whileHover={{ scale: profile.hobbies.length > 0 ? 1.02 : 1 }}
                  whileTap={{ scale: profile.hobbies.length > 0 ? 0.98 : 1 }}
                >
                  Next Step
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 3: Current Activity */}
          {step === 3 && (
            <motion.div
              key="step3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-bold text-center gradient-text mb-1">
                  Great choices! 🎯
                </h2>
                <p className="text-center text-gray-400 mb-6">
                  What best describes what you're currently doing?
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-6">
                <p className="text-lg font-medium text-primary-300 mb-4">
                  Select your current situation:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {currentActivityOptions.map((activity) => (
                    <motion.button
                      key={activity}
                      type="button"
                      onClick={() => handleActivitySelect(activity)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                        profile.currentActivity === activity
                          ? 'bg-primary-600 text-white border-primary-500'
                          : 'bg-dark-800 text-gray-300 border-primary-800/30 hover:bg-primary-900/30 hover:text-primary-300'
                      } border`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {activity}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex space-x-3">
                <motion.button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="w-1/3 border border-primary-600 text-primary-400 py-3 rounded-lg hover:bg-primary-900/30 hover:text-primary-300 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Back
                </motion.button>
                <motion.button
                  type="button"
                  onClick={nextStep}
                  disabled={!profile.currentActivity}
                  className="w-2/3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow font-medium"
                  whileHover={{ scale: profile.currentActivity ? 1.02 : 1 }}
                  whileTap={{ scale: profile.currentActivity ? 0.98 : 1 }}
                >
                  Next Step
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 4: Description */}
          {step === 4 && (
            <motion.div
              key="step4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-bold text-center gradient-text mb-1">
                  Tell us about yourself! ✨
                </h2>
                <p className="text-center text-gray-400 mb-6">
                  Write a short description about who you are and what you're passionate about.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-6">
                <p className="text-lg font-medium text-primary-300 mb-2">
                  Share a bit about yourself:
                </p>
                <textarea
                  name="description"
                  value={profile.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full bg-dark-800 border border-primary-800/30 text-white px-4 py-3 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 text-lg resize-none"
                  placeholder="I'm passionate about technology and love solving complex problems. In my free time, I enjoy reading and hiking..."
                />
                <p className="text-sm text-gray-400 mt-2">
                  {profile.description.length}/500 characters
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="flex space-x-3">
                <motion.button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="w-1/3 border border-primary-600 text-primary-400 py-3 rounded-lg hover:bg-primary-900/30 hover:text-primary-300 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Back
                </motion.button>
                <motion.button
                  type="button"
                  onClick={nextStep}
                  disabled={!profile.description || profile.description.length < 20}
                  className="w-2/3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow font-medium"
                  whileHover={{ scale: (profile.description && profile.description.length >= 20) ? 1.02 : 1 }}
                  whileTap={{ scale: (profile.description && profile.description.length >= 20) ? 0.98 : 1 }}
                >
                  Review Profile
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 5: Summary and Confirmation */}
          {step === 5 && (
            <motion.div
              key="step5"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-bold text-center gradient-text mb-1">
                  Profile Summary 📋
                </h2>
                <p className="text-center text-gray-400 mb-6">
                  Please review your information before confirming.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="glass bg-dark-800/50 p-6 rounded-xl border border-primary-800/30">
                <div className="space-y-4">
                  <div>
                    <span className="font-medium text-gray-400">Name:</span>
                    <p className="text-white text-lg">{profile.fullName}</p>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-400">Current Status:</span>
                    <p className="text-primary-300">{profile.currentActivity}</p>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-400">Hobbies & Interests:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profile.hobbies.map(hobby => (
                        <span key={hobby} className="inline-block text-xs py-1 px-2 rounded-md bg-primary-900/50 text-primary-300 border border-primary-800">
                          {hobby}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-400">About Me:</span>
                    <p className="text-gray-300 mt-1 text-sm leading-relaxed">{profile.description}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex space-x-3">
                <motion.button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="w-1/3 border border-primary-600 text-primary-400 py-3 rounded-lg hover:bg-primary-900/30 hover:text-primary-300 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Edit
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  className="w-2/3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white py-3 rounded-lg transition-all duration-300 hover:shadow-glow flex items-center justify-center font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Confirm & Complete
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8 pt-6 border-t border-dark-600"
        >
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${step === 1 ? 'bg-primary-400' : step > 1 ? 'bg-primary-500' : 'bg-primary-800'} mr-1`}></div>
              <div className={`w-6 h-1 ${step <= 1 ? 'bg-primary-800' : 'bg-primary-500'}`}></div>
              <div className={`w-3 h-3 rounded-full ${step === 2 ? 'bg-primary-400' : step > 2 ? 'bg-primary-500' : 'bg-primary-800'} mx-1`}></div>
              <div className={`w-6 h-1 ${step <= 2 ? 'bg-primary-800' : 'bg-primary-500'}`}></div>
              <div className={`w-3 h-3 rounded-full ${step === 3 ? 'bg-primary-400' : step > 3 ? 'bg-primary-500' : 'bg-primary-800'} mx-1`}></div>
              <div className={`w-6 h-1 ${step <= 3 ? 'bg-primary-800' : 'bg-primary-500'}`}></div>
              <div className={`w-3 h-3 rounded-full ${step === 4 ? 'bg-primary-400' : step > 4 ? 'bg-primary-500' : 'bg-primary-800'} mx-1`}></div>
              <div className={`w-6 h-1 ${step <= 4 ? 'bg-primary-800' : 'bg-primary-500'}`}></div>
              <div className={`w-3 h-3 rounded-full ${step === 5 ? 'bg-primary-400' : 'bg-primary-800'} ml-1`}></div>
            </div>
            <p className="ml-4 text-sm text-gray-400">
              Step {step} of 5 • Creating your personalized profile
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
