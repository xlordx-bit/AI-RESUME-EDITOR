import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { 
  FaEdit, 
  FaDownload, 
  FaSave, 
  FaEye, 
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaPrint,
  FaFileExport,
  FaUndo,
  FaRedo,
  FaFont,
  FaPalette,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaBold,
  FaItalic,
  FaUnderline
} from "react-icons/fa";

export default function ResumeEditor() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [resumeData, setResumeData] = useState(null);
  const [selectedSection, setSelectedSection] = useState('personalInfo');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editHistory, setEditHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const previewRef = useRef(null);

  useEffect(() => {
    // Load resume data from localStorage
    const savedData = localStorage.getItem('generatedResumeData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setResumeData(data);
      setEditHistory([data]);
      setHistoryIndex(0);
    } else {
      navigate('/ai-resume-maker');
    }
  }, [navigate]);

  const saveToHistory = (newData) => {
    const newHistory = editHistory.slice(0, historyIndex + 1);
    newHistory.push(newData);
    setEditHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setResumeData(editHistory[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < editHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setResumeData(editHistory[historyIndex + 1]);
    }
  };

  const handleDataChange = (section, field, value, index = null) => {
    setResumeData(prev => {
      let newData;
      if (index !== null) {
        const newArray = [...prev[section]];
        newArray[index] = { ...newArray[index], [field]: value };
        newData = { ...prev, [section]: newArray };
      } else if (section === 'personalInfo') {
        newData = {
          ...prev,
          personalInfo: { ...prev.personalInfo, [field]: value }
        };
      } else {
        newData = { ...prev, [field]: value };
      }
      
      saveToHistory(newData);
      return newData;
    });
  };

  const addArrayItem = (section) => {
    const newItem = section === 'experience' 
      ? { title: '', company: '', duration: '', description: '', location: '' }
      : section === 'education'
      ? { degree: '', institution: '', year: '', gpa: '', location: '' }
      : section === 'projects'
      ? { name: '', description: '', technologies: '', link: '' }
      : section === 'certifications'
      ? { name: '', issuer: '', date: '', id: '' }
      : '';

    setResumeData(prev => {
      const newData = {
        ...prev,
        [section]: [...(prev[section] || []), newItem]
      };
      saveToHistory(newData);
      return newData;
    });
  };

  const removeArrayItem = (section, index) => {
    setResumeData(prev => {
      const newData = {
        ...prev,
        [section]: prev[section].filter((_, i) => i !== index)
      };
      saveToHistory(newData);
      return newData;
    });
  };

  const saveResume = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem('savedResumeData', JSON.stringify(resumeData));
      
      // Here you could also save to backend
      // await saveResumeToBackend(resumeData);
      
      // Show success message
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-600 text-white py-3 px-6 rounded-lg shadow-lg z-50';
      toast.innerHTML = 'Resume saved successfully!';
      document.body.appendChild(toast);
      
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 3000);
    } catch (error) {
      console.error('Error saving resume:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const downloadResume = () => {
    // Convert resume to PDF (mock implementation)
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Resume - ${resumeData?.personalInfo?.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 18px; font-weight: bold; border-bottom: 2px solid #333; padding-bottom: 5px; margin-bottom: 15px; }
            .experience-item, .education-item, .project-item { margin-bottom: 15px; }
            .job-title { font-weight: bold; }
            .company { font-style: italic; }
            .duration { color: #666; }
            .skills { display: flex; flex-wrap: wrap; gap: 10px; }
            .skill { background: #f0f0f0; padding: 5px 10px; border-radius: 5px; }
          </style>
        </head>
        <body>
          ${generateResumeHTML()}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const generateResumeHTML = () => {
    if (!resumeData) return '';

    return `
      <div class="header">
        <h1>${resumeData.personalInfo?.name || ''}</h1>
        <h2>${resumeData.personalInfo?.title || ''}</h2>
        <p>${resumeData.personalInfo?.email || ''} | ${resumeData.personalInfo?.phone || ''} | ${resumeData.personalInfo?.location || ''}</p>
        ${resumeData.personalInfo?.linkedin ? `<p>LinkedIn: ${resumeData.personalInfo.linkedin}</p>` : ''}
      </div>

      ${resumeData.summary ? `
        <div class="section">
          <div class="section-title">Professional Summary</div>
          <p>${resumeData.summary}</p>
        </div>
      ` : ''}

      ${resumeData.experience?.length > 0 ? `
        <div class="section">
          <div class="section-title">Work Experience</div>
          ${resumeData.experience.map(exp => `
            <div class="experience-item">
              <div class="job-title">${exp.title}</div>
              <div class="company">${exp.company} | ${exp.location}</div>
              <div class="duration">${exp.duration}</div>
              <p>${exp.description}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${resumeData.education?.length > 0 ? `
        <div class="section">
          <div class="section-title">Education</div>
          ${resumeData.education.map(edu => `
            <div class="education-item">
              <div class="job-title">${edu.degree}</div>
              <div class="company">${edu.institution}</div>
              <div class="duration">${edu.year}</div>
              ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${resumeData.skills?.length > 0 ? `
        <div class="section">
          <div class="section-title">Skills</div>
          <div class="skills">
            ${resumeData.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      ${resumeData.projects?.length > 0 ? `
        <div class="section">
          <div class="section-title">Projects</div>
          ${resumeData.projects.map(project => `
            <div class="project-item">
              <div class="job-title">${project.name}</div>
              <p>${project.description}</p>
              <p><strong>Technologies:</strong> ${project.technologies}</p>
              ${project.link ? `<p><strong>Link:</strong> ${project.link}</p>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
    `;
  };

  const renderEditingPanel = () => {
    if (!resumeData) return null;

    const sections = [
      { id: 'personalInfo', name: 'Personal Info', icon: FaEdit },
      { id: 'summary', name: 'Summary', icon: FaEdit },
      { id: 'experience', name: 'Experience', icon: FaEdit },
      { id: 'education', name: 'Education', icon: FaEdit },
      { id: 'skills', name: 'Skills', icon: FaEdit },
      { id: 'projects', name: 'Projects', icon: FaEdit }
    ];

    return (
      <div className="w-1/3 bg-dark-800 border-r border-dark-700 overflow-y-auto">
        <div className="p-4 border-b border-dark-700">
          <h2 className="text-xl font-bold text-white mb-4">Edit Resume</h2>
          <div className="grid grid-cols-2 gap-2">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setSelectedSection(section.id)}
                className={`p-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  selectedSection === section.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                }`}
              >
                {section.name}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 space-y-4">
          {selectedSection === 'personalInfo' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Personal Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    value={resumeData.personalInfo?.name || ''}
                    onChange={(e) => handleDataChange('personalInfo', 'name', e.target.value)}
                    className="w-full p-2 bg-dark-700 border border-dark-600 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={resumeData.personalInfo?.title || ''}
                    onChange={(e) => handleDataChange('personalInfo', 'title', e.target.value)}
                    className="w-full p-2 bg-dark-700 border border-dark-600 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={resumeData.personalInfo?.email || ''}
                    onChange={(e) => handleDataChange('personalInfo', 'email', e.target.value)}
                    className="w-full p-2 bg-dark-700 border border-dark-600 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={resumeData.personalInfo?.phone || ''}
                    onChange={(e) => handleDataChange('personalInfo', 'phone', e.target.value)}
                    className="w-full p-2 bg-dark-700 border border-dark-600 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={resumeData.personalInfo?.location || ''}
                    onChange={(e) => handleDataChange('personalInfo', 'location', e.target.value)}
                    className="w-full p-2 bg-dark-700 border border-dark-600 rounded text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedSection === 'summary' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Professional Summary</h3>
              <textarea
                value={resumeData.summary || ''}
                onChange={(e) => handleDataChange('', 'summary', e.target.value)}
                rows={6}
                className="w-full p-3 bg-dark-700 border border-dark-600 rounded text-white"
                placeholder="Write your professional summary..."
              />
            </div>
          )}

          {selectedSection === 'experience' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Work Experience</h3>
                <button
                  onClick={() => addArrayItem('experience')}
                  className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded"
                >
                  <FaPlus className="w-4 h-4" />
                </button>
              </div>
              {resumeData.experience?.map((exp, index) => (
                <div key={index} className="bg-dark-700 p-4 rounded border border-dark-600">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-400">Experience {index + 1}</span>
                    <button
                      onClick={() => removeArrayItem('experience', index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={exp.title || ''}
                      onChange={(e) => handleDataChange('experience', 'title', e.target.value, index)}
                      placeholder="Job Title"
                      className="w-full p-2 bg-dark-800 border border-dark-600 rounded text-white"
                    />
                    <input
                      type="text"
                      value={exp.company || ''}
                      onChange={(e) => handleDataChange('experience', 'company', e.target.value, index)}
                      placeholder="Company"
                      className="w-full p-2 bg-dark-800 border border-dark-600 rounded text-white"
                    />
                    <input
                      type="text"
                      value={exp.duration || ''}
                      onChange={(e) => handleDataChange('experience', 'duration', e.target.value, index)}
                      placeholder="Duration"
                      className="w-full p-2 bg-dark-800 border border-dark-600 rounded text-white"
                    />
                    <textarea
                      value={exp.description || ''}
                      onChange={(e) => handleDataChange('experience', 'description', e.target.value, index)}
                      placeholder="Description"
                      rows={3}
                      className="w-full p-2 bg-dark-800 border border-dark-600 rounded text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedSection === 'education' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Education</h3>
                <button
                  onClick={() => addArrayItem('education')}
                  className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded"
                >
                  <FaPlus className="w-4 h-4" />
                </button>
              </div>
              {resumeData.education?.map((edu, index) => (
                <div key={index} className="bg-dark-700 p-4 rounded border border-dark-600">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-400">Education {index + 1}</span>
                    <button
                      onClick={() => removeArrayItem('education', index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={edu.degree || ''}
                      onChange={(e) => handleDataChange('education', 'degree', e.target.value, index)}
                      placeholder="Degree"
                      className="w-full p-2 bg-dark-800 border border-dark-600 rounded text-white"
                    />
                    <input
                      type="text"
                      value={edu.institution || ''}
                      onChange={(e) => handleDataChange('education', 'institution', e.target.value, index)}
                      placeholder="Institution"
                      className="w-full p-2 bg-dark-800 border border-dark-600 rounded text-white"
                    />
                    <input
                      type="text"
                      value={edu.year || ''}
                      onChange={(e) => handleDataChange('education', 'year', e.target.value, index)}
                      placeholder="Year"
                      className="w-full p-2 bg-dark-800 border border-dark-600 rounded text-white"
                    />
                    <input
                      type="text"
                      value={edu.gpa || ''}
                      onChange={(e) => handleDataChange('education', 'gpa', e.target.value, index)}
                      placeholder="GPA (optional)"
                      className="w-full p-2 bg-dark-800 border border-dark-600 rounded text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedSection === 'projects' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Projects</h3>
                <button
                  onClick={() => addArrayItem('projects')}
                  className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded"
                >
                  <FaPlus className="w-4 h-4" />
                </button>
              </div>
              {resumeData.projects?.map((project, index) => (
                <div key={index} className="bg-dark-700 p-4 rounded border border-dark-600">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-400">Project {index + 1}</span>
                    <button
                      onClick={() => removeArrayItem('projects', index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={project.name || ''}
                      onChange={(e) => handleDataChange('projects', 'name', e.target.value, index)}
                      placeholder="Project Name"
                      className="w-full p-2 bg-dark-800 border border-dark-600 rounded text-white"
                    />
                    <textarea
                      value={project.description || ''}
                      onChange={(e) => handleDataChange('projects', 'description', e.target.value, index)}
                      placeholder="Project Description"
                      rows={3}
                      className="w-full p-2 bg-dark-800 border border-dark-600 rounded text-white"
                    />
                    <input
                      type="text"
                      value={project.technologies || ''}
                      onChange={(e) => handleDataChange('projects', 'technologies', e.target.value, index)}
                      placeholder="Technologies Used"
                      className="w-full p-2 bg-dark-800 border border-dark-600 rounded text-white"
                    />
                    <input
                      type="url"
                      value={project.link || ''}
                      onChange={(e) => handleDataChange('projects', 'link', e.target.value, index)}
                      placeholder="Project Link (optional)"
                      className="w-full p-2 bg-dark-800 border border-dark-600 rounded text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedSection === 'skills' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {resumeData.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {skill}
                    <button
                      onClick={() => removeArrayItem('skills', index)}
                      className="text-white hover:text-red-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="skillInput"
                  placeholder="Add a skill"
                  className="flex-1 p-2 bg-dark-700 border border-dark-600 rounded text-white"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      setResumeData(prev => {
                        const newData = {
                          ...prev,
                          skills: [...(prev.skills || []), e.target.value.trim()]
                        };
                        saveToHistory(newData);
                        return newData;
                      });
                      e.target.value = '';
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.getElementById('skillInput');
                    if (input.value.trim()) {
                      setResumeData(prev => {
                        const newData = {
                          ...prev,
                          skills: [...(prev.skills || []), input.value.trim()]
                        };
                        saveToHistory(newData);
                        return newData;
                      });
                      input.value = '';
                    }
                  }}
                  className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded"
                >
                  <FaPlus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPreview = () => {
    if (!resumeData) return null;

    return (
      <div className="flex-1 bg-white overflow-y-auto">
        <div ref={previewRef} className="max-w-4xl mx-auto p-8 bg-white text-black min-h-screen">
          {/* Header */}
          <div className="text-center mb-8 border-b-2 border-gray-200 pb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{resumeData.personalInfo?.name || ''}</h1>
            <h2 className="text-xl text-gray-600 mb-4">{resumeData.personalInfo?.title || ''}</h2>
            <div className="flex justify-center space-x-4 text-sm text-gray-600">
              <span>{resumeData.personalInfo?.email || ''}</span>
              <span>•</span>
              <span>{resumeData.personalInfo?.phone || ''}</span>
              <span>•</span>
              <span>{resumeData.personalInfo?.location || ''}</span>
            </div>
            {resumeData.personalInfo?.linkedin && (
              <div className="mt-2 text-sm text-blue-600">
                {resumeData.personalInfo.linkedin}
              </div>
            )}
          </div>

          {/* Summary */}
          {resumeData.summary && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">
                Professional Summary
              </h3>
              <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
            </div>
          )}

          {/* Experience */}
          {resumeData.experience?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">
                Work Experience
              </h3>
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{exp.title}</h4>
                      <p className="text-gray-600 font-medium">{exp.company}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>{exp.duration}</p>
                      <p>{exp.location}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {resumeData.education?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">
                Education
              </h3>
              {resumeData.education.map((edu, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{edu.degree}</h4>
                      <p className="text-gray-600">{edu.institution}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>{edu.year}</p>
                      {edu.gpa && <p>GPA: {edu.gpa}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {resumeData.skills?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <span key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {resumeData.projects?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">
                Projects
              </h3>
              {resumeData.projects.map((project, index) => (
                <div key={index} className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h4>
                  <p className="text-gray-700 mb-2">{project.description}</p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Technologies:</strong> {project.technologies}
                  </p>
                  {project.link && (
                    <p className="text-sm text-blue-600">
                      <strong>Link:</strong> {project.link}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!resumeData) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Header */}
      <div className="bg-dark-800 border-b border-dark-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/ai-resume-maker')}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <FaArrowLeft className="w-4 h-4" />
              Back
            </motion.button>
            <h1 className="text-2xl font-bold gradient-text">Resume Editor</h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Undo/Redo */}
            <div className="flex space-x-2">
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className={`p-2 rounded ${
                  historyIndex <= 0
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-dark-600 hover:bg-dark-500 text-white'
                }`}
              >
                <FaUndo className="w-4 h-4" />
              </button>
              <button
                onClick={redo}
                disabled={historyIndex >= editHistory.length - 1}
                className={`p-2 rounded ${
                  historyIndex >= editHistory.length - 1
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-dark-600 hover:bg-dark-500 text-white'
                }`}
              >
                <FaRedo className="w-4 h-4" />
              </button>
            </div>

            {/* Preview Toggle */}
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isPreviewMode
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-600 hover:bg-dark-500 text-gray-300'
              }`}
            >
              <FaEye className="w-4 h-4" />
              {isPreviewMode ? 'Edit' : 'Preview'}
            </button>

            {/* Save */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={saveResume}
              disabled={isSaving}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaSave className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </motion.button>

            {/* Download */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadResume}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaDownload className="w-4 h-4" />
              Download
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-screen">
        {!isPreviewMode && renderEditingPanel()}
        {renderPreview()}
      </div>
    </div>
  );
}
