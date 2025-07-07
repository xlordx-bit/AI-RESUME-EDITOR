import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FaRobot, 
  FaUpload, 
  FaDownload, 
  FaArrowLeft,
  FaSpinner,
  FaCheck,
  FaFileAlt
} from "react-icons/fa";

export default function AIResumeMaker() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [jobDescription, setJobDescription] = useState("");
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: ""
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const fileInputRef = useRef(null);

  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateResume = async () => {
    setIsGenerating(true);
    
    // Simulate AI resume generation
    setTimeout(() => {
      const generatedResume = {
        personalInfo,
        summary: `Experienced professional with expertise in ${jobDescription.toLowerCase().includes('software') ? 'software development' : 'various technologies'}. Passionate about innovation and delivering high-quality solutions.`,
        experience: [
          {
            title: "Senior Professional",
            company: "Tech Company",
            duration: "2022 - Present",
            location: personalInfo.location || "Remote",
            description: "Led cross-functional teams and delivered impactful projects aligned with business objectives."
          },
          {
            title: "Professional",
            company: "Previous Company",
            duration: "2020 - 2022",
            location: personalInfo.location || "Remote",
            description: "Developed innovative solutions and collaborated with stakeholders to achieve organizational goals."
          }
        ],
        education: [
          {
            degree: "Bachelor's Degree",
            institution: "University",
            year: "2020",
            gpa: "3.8",
            location: personalInfo.location || "City, State"
          }
        ],
        skills: [
          "Leadership",
          "Project Management",
          "Communication",
          "Problem Solving",
          "Team Collaboration",
          "Strategic Planning"
        ],
        projects: [
          {
            name: "Innovation Project",
            description: "Developed and implemented a comprehensive solution that improved efficiency by 40%.",
            technologies: "Various Technologies",
            link: "https://github.com/example/project"
          }
        ]
      };

      // Save to localStorage
      localStorage.setItem('generatedResumeData', JSON.stringify(generatedResume));
      setResumeData(generatedResume);
      setIsGenerating(false);
      setStep(3);
    }, 3000);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle file upload logic here
      console.log("File uploaded:", file.name);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <FaRobot className="w-16 h-16 text-primary-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-white mb-4">AI Resume Builder</h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Create a professional resume tailored to your target job using AI. 
          Provide your information and job details, and our AI will craft the perfect resume for you.
        </p>
      </div>

      <div className="bg-dark-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              value={personalInfo.name}
              onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
              className="w-full p-3 bg-dark-700 border border-dark-600 rounded text-white"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={personalInfo.email}
              onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
              className="w-full p-3 bg-dark-700 border border-dark-600 rounded text-white"
              placeholder="your.email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
            <input
              type="tel"
              value={personalInfo.phone}
              onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
              className="w-full p-3 bg-dark-700 border border-dark-600 rounded text-white"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
            <input
              type="text"
              value={personalInfo.location}
              onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
              className="w-full p-3 bg-dark-700 border border-dark-600 rounded text-white"
              placeholder="City, State"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn Profile (Optional)</label>
            <input
              type="url"
              value={personalInfo.linkedin}
              onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
              className="w-full p-3 bg-dark-700 border border-dark-600 rounded text-white"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Upload Existing Resume (Optional)
          </label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-primary-600 transition-colors"
          >
            <FaUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400">Click to upload your existing resume</p>
            <p className="text-sm text-gray-500 mt-1">PDF, DOC, or DOCX files</p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx"
            className="hidden"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setStep(2)}
          disabled={!personalInfo.name || !personalInfo.email}
          className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Next Step
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <FaFileAlt className="w-16 h-16 text-primary-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-white mb-4">Job Description</h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Paste the job description you're applying for. Our AI will analyze it and tailor your resume accordingly.
        </p>
      </div>

      <div className="bg-dark-800 p-6 rounded-lg">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Job Description
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={12}
          className="w-full p-3 bg-dark-700 border border-dark-600 rounded text-white"
          placeholder="Paste the complete job description here..."
        />
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep(1)}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <FaArrowLeft className="w-4 h-4 inline mr-2" />
          Back
        </button>
        <button
          onClick={generateResume}
          disabled={!jobDescription.trim()}
          className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Generate Resume with AI
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      {isGenerating ? (
        <div className="text-center py-12">
          <FaSpinner className="w-16 h-16 text-primary-600 mx-auto mb-4 animate-spin" />
          <h2 className="text-3xl font-bold text-white mb-4">Generating Your Resume</h2>
          <p className="text-gray-300">
            Our AI is analyzing the job description and crafting your perfect resume...
          </p>
        </div>
      ) : (
        <div className="text-center">
          <FaCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Resume Generated Successfully!</h2>
          <p className="text-gray-300 mb-6">
            Your AI-powered resume has been created and is ready for editing.
          </p>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/resume-editor')}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Edit Resume
            </button>
            <button
              onClick={() => {
                setStep(1);
                setJobDescription("");
                setPersonalInfo({
                  name: "",
                  email: "",
                  phone: "",
                  location: "",
                  linkedin: ""
                });
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Create Another Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Header */}
      <div className="bg-dark-800 border-b border-dark-700 px-6 py-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <FaArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </motion.button>
            <h1 className="text-2xl font-bold gradient-text">AI Resume Maker</h1>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                {stepNumber}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
}
