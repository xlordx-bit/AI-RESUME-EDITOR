import { FaRobot, FaChartLine, FaFileAlt, FaRocket } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="bg-dark-900 text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative text-center py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-dark-800 to-dark-950 bg-gradient-animate animate-gradient"></div>
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-600 rounded-full opacity-20 blur-[120px] animate-pulse-slow"></div>
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-primary-700 rounded-full opacity-20 blur-[150px] animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
        </div>
        
        {/* Floating particles */}
        <div className="particle-bg absolute inset-0 z-0">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold mb-6 gradient-text-vibrant"
          >
            Supercharge Your <span className="text-primary-400">Resume</span> with AI
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-300 mb-10 max-w-2xl mx-auto text-lg"
          >
            SkillSync helps you match your resume to job roles using AI, job market analysis, and real-time suggestions with precision.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex gap-4 justify-center"
          >
            <motion.a
              href="/getting-started"
              className="relative bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white py-4 px-10 rounded-lg font-medium text-lg transition-all duration-300 hover:shadow-glow inline-flex items-center gap-3 btn-glow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Get Started</span>
              <svg className="w-5 h-5 animate-shimmer" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.a>
            <motion.a
              href="/test-data-setup"
              className="bg-dark-700 hover:bg-dark-600 border border-primary-600 text-white py-4 px-8 rounded-lg font-medium text-lg transition-all duration-300 inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaRocket className="w-5 h-5" />
              Try Demo
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-dark-800 relative">
        {/* Purple accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent"></div>
        
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-16 gradient-text"
        >
          What SkillSync Offers
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-8 max-w-7xl mx-auto">
          <Feature icon={<FaRobot size={36} />} title="AI-Powered Tweaks" desc="Get personalized resume improvements with cutting-edge GPT technology." />
          <Feature icon={<FaChartLine size={36} />} title="Skill Gap Analysis" desc="See how your resume matches market demands in real time with precision." />
          <Feature icon={<FaFileAlt size={36} />} title="Smart Parsing" desc="Upload and scan your resume instantly with our advanced document parser." />
          <Feature icon={<FaRocket size={36} />} title="Fast & Secure" desc="Lightning-fast suggestions with privacy-first encryption for your data." />
        </div>
      </section>

      {/* AI Preview */}
      <section className="py-16 bg-gray-50 text-center px-4">
        <h2 className="text-3xl font-semibold mb-6">See SkillSync in Action</h2>
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md border">
          <p className="text-sm mb-2 text-gray-500">Before:</p>
          <p className="italic mb-4 text-gray-600">
            “Worked on multiple projects across different teams.”
          </p>
          <p className="text-sm mb-2 text-gray-500">After (AI-Enhanced):</p>
          <p className="font-medium text-blue-800">
            “Led 5+ cross-functional projects, improving collaboration by 30%.”
          </p>
        </div>
      </section>

      {/* Trusted Section */}
      <section className="py-12 bg-white text-center">
        <h3 className="text-2xl font-semibold mb-6">Trusted by Students & Professionals From</h3>
        <div className="flex justify-center gap-6 flex-wrap grayscale opacity-70">
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" alt="Google" className="h-10" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/02/Microsoft_logo_(2012).svg" alt="Microsoft" className="h-10" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className="h-10" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/LinkedIn_Logo.svg" alt="LinkedIn" className="h-10" />
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="text-center py-12 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <h4 className="text-2xl font-semibold mb-4">Ready to Optimize Your Resume?</h4>
        <a href="/upload" className="btn-outline text-white border-white hover:bg-white hover:text-blue-800">
          Upload Resume
        </a>
      </footer>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="text-center border rounded-xl p-6 shadow-sm hover:shadow-lg transition">
      <div className="mb-4 text-blue-600">{icon}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}
