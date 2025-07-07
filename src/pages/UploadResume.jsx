import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { FaFileUpload, FaFilePdf, FaFileWord, FaCheck, FaTimes, FaDownload, FaEye, FaTrash, FaRobot, FaChartLine } from "react-icons/fa";

const API_BASE_URL = 'http://localhost:5000/api';

export default function UploadResume() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileId, setFileId] = useState(null);
  const [backendConnected, setBackendConnected] = useState(false);
  const [checkingConnection, setCheckingConnection] = useState(true);

  const acceptedTypes = ['.pdf', '.doc', '.docx'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  // Check backend connection on component mount
  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        
        if (response.ok) {
          setBackendConnected(true);
          showSuccessToast('Backend connected successfully!');
        } else {
          setBackendConnected(false);
          showErrorToast('Backend connection failed. Please ensure the server is running.');
        }
      } catch (error) {
        setBackendConnected(false);
        showErrorToast('Unable to connect to backend. Make sure the server is running on http://localhost:5000');
        console.error('Backend connection error:', error);
      } finally {
        setCheckingConnection(false);
      }
    };

    checkBackendConnection();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    // Check backend connection first
    if (!backendConnected) {
      showErrorToast('Backend not connected. Please ensure the server is running.');
      return;
    }

    // Validate file type
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      showErrorToast('Please upload a PDF, DOC, or DOCX file');
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      showErrorToast('File size must be less than 10MB');
      return;
    }

    try {
      // Start upload
      setIsUploading(true);
      setUploadProgress(0);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user?.uid || 'anonymous');

      // Upload file to backend
      const uploadResponse = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const uploadResult = await uploadResponse.json();
      
      setUploadProgress(100);
      setIsUploading(false);
      
      // Set uploaded file info
      const fileInfo = {
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
        fileId: uploadResult.file_id
      };
      
      setUploadedFile(fileInfo);
      setFileId(uploadResult.file_id);
      
      // Save to localStorage
      if (user?.uid) {
        localStorage.setItem(`resume-data-${user.uid}`, JSON.stringify(fileInfo));
      }
      
      showSuccessToast('Resume uploaded successfully!');
      
      // Start analysis automatically
      setTimeout(() => {
        analyzeResume(uploadResult.file_id);
      }, 1000);
      
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      showErrorToast('Upload failed. Please try again.');
      console.error('Upload error:', error);
    }
  };

  const analyzeResume = async (fileId) => {
    try {
      setIsAnalyzing(true);
      
      // Call backend analysis endpoint
      const analysisResponse = await fetch(`${API_BASE_URL}/analyze/${fileId}`);
      
      if (!analysisResponse.ok) {
        throw new Error('Analysis failed');
      }
      
      const analysisResult = await analysisResponse.json();
      setAnalysisResults(analysisResult.analysis);
      setIsAnalyzing(false);
      
      showSuccessToast('Resume analysis completed!');
      
    } catch (error) {
      setIsAnalyzing(false);
      showErrorToast('Analysis failed. Please try again.');
      console.error('Analysis error:', error);
    }
  };

  const retryAnalysis = () => {
    if (fileId) {
      analyzeResume(fileId);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setAnalysisResults(null);
    setFileId(null);
    setIsAnalyzing(false);
    if (user?.uid) {
      localStorage.removeItem(`resume-data-${user.uid}`);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (extension === 'pdf') return <FaFilePdf className="w-8 h-8 text-red-400" />;
    if (extension === 'doc' || extension === 'docx') return <FaFileWord className="w-8 h-8 text-blue-400" />;
    return <FaFileUpload className="w-8 h-8 text-gray-400" />;
  };

  const showSuccessToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-600 text-white py-3 px-6 rounded-lg shadow-lg flex items-center z-50 transition-opacity duration-300';
    toast.innerHTML = `
      <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
      ${message}
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('opacity-0');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  const showErrorToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-red-600 text-white py-3 px-6 rounded-lg shadow-lg flex items-center z-50 transition-opacity duration-300';
    toast.innerHTML = `
      <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
      ${message}
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('opacity-0');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
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

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black bg-gradient-animate animate-gradient"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600 rounded-full opacity-5 blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-700 rounded-full opacity-5 blur-[100px] animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative z-10 p-6 lg:p-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={cardVariants} className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold gradient-text mb-2">
              Upload Your Resume 📄
            </h1>
            <p className="text-gray-400 text-lg">
              Get AI-powered insights and optimize your resume for job applications
            </p>
          </motion.div>

          {/* Backend Connection Status */}
          <motion.div variants={cardVariants} className="mb-6">
            <div className={`flex items-center gap-3 p-4 rounded-lg border ${
              checkingConnection 
                ? 'bg-yellow-900/20 border-yellow-800/20 text-yellow-400' 
                : backendConnected 
                  ? 'bg-green-900/20 border-green-800/20 text-green-400'
                  : 'bg-red-900/20 border-red-800/20 text-red-400'
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                checkingConnection 
                  ? 'bg-yellow-400 animate-pulse' 
                  : backendConnected 
                    ? 'bg-green-400'
                    : 'bg-red-400'
              }`}></div>
              <span className="text-sm font-medium">
                {checkingConnection 
                  ? 'Connecting to backend...' 
                  : backendConnected 
                    ? 'Backend connected - Ready to analyze resumes'
                    : 'Backend disconnected - Please start the server'
                }
              </span>
              {!backendConnected && !checkingConnection && (
                <button
                  onClick={() => window.location.reload()}
                  className="ml-auto px-3 py-1 text-xs bg-red-600/20 hover:bg-red-600/30 rounded border border-red-600/30 transition-colors"
                >
                  Retry
                </button>
              )}
            </div>
          </motion.div>

          {!uploadedFile ? (
            /* Upload Area */
            <motion.div variants={cardVariants}>
              <div
                className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer ${
                  dragActive 
                    ? 'border-primary-400 bg-primary-900/20' 
                    : 'border-gray-600 hover:border-primary-600 hover:bg-primary-900/10'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <motion.div
                  animate={{ scale: dragActive ? 1.1 : 1 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="w-16 h-16 bg-primary-600/20 rounded-full flex items-center justify-center mx-auto">
                    <FaFileUpload className="w-8 h-8 text-primary-400" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {dragActive ? 'Drop your resume here' : 'Upload your resume'}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Drag & drop or click to browse
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports PDF, DOC, DOCX up to 10MB
                    </p>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-glow font-medium"
                  >
                    Choose File
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            /* File Uploaded */
            <div className="space-y-6">
              {/* Upload Progress */}
              {isUploading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-primary-800/20"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-8 h-8 bg-primary-600/20 rounded-lg flex items-center justify-center">
                      <FaFileUpload className="w-4 h-4 text-primary-400 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Uploading...</h3>
                      <p className="text-sm text-gray-400">{uploadProgress}% complete</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-primary-600 to-primary-700 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              )}

              {/* Uploaded File Display */}
              {!isUploading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-primary-800/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getFileIcon(uploadedFile.name)}
                      <div>
                        <h3 className="font-semibold text-white">{uploadedFile.name}</h3>
                        <p className="text-sm text-gray-400">
                          {formatFileSize(uploadedFile.size)} • Uploaded {new Date(uploadedFile.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-colors duration-300"
                      >
                        <FaCheck className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleRemoveFile}
                        className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors duration-300"
                      >
                        <FaTrash className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* AI Analysis Results */}
              <AnimatePresence>
                {isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-primary-800/20"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center">
                        <FaRobot className="w-5 h-5 text-primary-400 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Analyzing Resume...</h3>
                        <p className="text-gray-400">AI is processing your resume</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="animate-pulse flex space-x-4">
                        <div className="rounded-full bg-primary-700 h-4 w-4"></div>
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-2 bg-primary-700 rounded w-3/4"></div>
                          <div className="h-2 bg-primary-700 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {analysisResults && !isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Overall Score */}
                    <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-primary-800/20">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center">
                            <FaRobot className="w-5 h-5 text-primary-400" />
                          </div>
                          <h3 className="text-xl font-bold text-white">AI Analysis Complete</h3>
                        </div>
                        <button
                          onClick={retryAnalysis}
                          className="px-4 py-2 bg-primary-600/20 text-primary-400 rounded-lg hover:bg-primary-600/30 transition-colors duration-300"
                        >
                          Re-analyze
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary-400 mb-2">
                            {analysisResults.overall_score || 0}/100
                          </div>
                          <p className="text-gray-400">Overall Score</p>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-400 mb-2">
                            {analysisResults.ats_compatibility || 0}%
                          </div>
                          <p className="text-gray-400">ATS Compatible</p>
                        </div>
                      </div>
                    </div>

                    {/* Structure and Keywords */}
                    {analysisResults.structure && (
                      <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-primary-800/20">
                        <h4 className="text-lg font-semibold text-white mb-4">Resume Structure</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400 mb-1">
                              {analysisResults.structure.word_count || 0}
                            </div>
                            <p className="text-gray-400 text-sm">Words</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-400 mb-1">
                              {analysisResults.structure.bullet_points || 0}
                            </div>
                            <p className="text-gray-400 text-sm">Bullet Points</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-400 mb-1">
                              {analysisResults.keywords?.total_count || 0}
                            </div>
                            <p className="text-gray-400 text-sm">Keywords</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {analysisResults.recommendations && analysisResults.recommendations.length > 0 && (
                      <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-yellow-800/20">
                        <h4 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
                          <FaChartLine className="w-4 h-4" />
                          Recommendations
                        </h4>
                        <ul className="space-y-3">
                          {analysisResults.recommendations.map((recommendation, index) => (
                            <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                              {recommendation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Keywords */}
                    {analysisResults.keywords && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {analysisResults.keywords.technical && analysisResults.keywords.technical.length > 0 && (
                          <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-primary-800/20">
                            <h4 className="text-lg font-semibold text-white mb-4">Technical Keywords</h4>
                            <div className="flex flex-wrap gap-2">
                              {analysisResults.keywords.technical.map((keyword, index) => (
                                <span
                                  key={index}
                                  className="inline-block py-1 px-3 rounded-full bg-blue-900/50 text-blue-300 border border-blue-800 text-sm"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {analysisResults.keywords.soft_skills && analysisResults.keywords.soft_skills.length > 0 && (
                          <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-primary-800/20">
                            <h4 className="text-lg font-semibold text-white mb-4">Soft Skills</h4>
                            <div className="flex flex-wrap gap-2">
                              {analysisResults.keywords.soft_skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="inline-block py-1 px-3 rounded-full bg-green-900/50 text-green-300 border border-green-800 text-sm"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Verbs */}
                    {analysisResults.keywords?.action_verbs && analysisResults.keywords.action_verbs.length > 0 && (
                      <div className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-primary-800/20">
                        <h4 className="text-lg font-semibold text-white mb-4">Action Verbs Found</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysisResults.keywords.action_verbs.map((verb, index) => (
                            <span
                              key={index}
                              className="inline-block py-1 px-3 rounded-full bg-purple-900/50 text-purple-300 border border-purple-800 text-sm"
                            >
                              {verb}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/dashboard')}
                        className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-glow font-medium"
                      >
                        View Dashboard
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleRemoveFile}
                        className="px-6 py-3 border border-primary-600 text-primary-400 rounded-lg hover:bg-primary-900/30 hover:text-primary-300 transition-all duration-300"
                      >
                        Upload Another
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
