import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TestDataSetup() {
  const navigate = useNavigate();

  useEffect(() => {
    // Sample resume data for testing
    const sampleResumeData = {
      personalInfo: {
        name: "John Doe",
        title: "Software Engineer",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        linkedin: "https://linkedin.com/in/johndoe"
      },
      summary: "Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Passionate about creating scalable solutions and leading development teams.",
      experience: [
        {
          title: "Senior Software Engineer",
          company: "Tech Corp",
          duration: "2022 - Present",
          location: "San Francisco, CA",
          description: "Led development of microservices architecture serving 1M+ users. Implemented CI/CD pipelines reducing deployment time by 60%. Mentored junior developers and conducted code reviews."
        },
        {
          title: "Software Engineer",
          company: "StartupXYZ",
          duration: "2020 - 2022",
          location: "Remote",
          description: "Developed responsive web applications using React and TypeScript. Built RESTful APIs with Node.js and Express. Collaborated with UX/UI designers to implement pixel-perfect designs."
        }
      ],
      education: [
        {
          degree: "Bachelor of Science in Computer Science",
          institution: "University of California, Berkeley",
          year: "2020",
          gpa: "3.8",
          location: "Berkeley, CA"
        }
      ],
      skills: [
        "JavaScript",
        "React",
        "Node.js",
        "Python",
        "AWS",
        "Docker",
        "MongoDB",
        "PostgreSQL",
        "Git",
        "Agile/Scrum"
      ],
      projects: [
        {
          name: "E-commerce Platform",
          description: "Built a full-stack e-commerce platform with React frontend and Node.js backend, featuring payment integration and real-time inventory management.",
          technologies: "React, Node.js, MongoDB, Stripe API, AWS",
          link: "https://github.com/johndoe/ecommerce-platform"
        },
        {
          name: "Task Management App",
          description: "Developed a collaborative task management application with real-time updates and team collaboration features.",
          technologies: "React, Socket.io, Express, PostgreSQL",
          link: "https://github.com/johndoe/task-manager"
        }
      ]
    };

    // Store sample data in localStorage for testing
    localStorage.setItem('generatedResumeData', JSON.stringify(sampleResumeData));
    
    // Redirect to resume editor after setting data
    setTimeout(() => {
      navigate('/resume-editor');
    }, 2000);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Setting up test data...</h1>
        <p className="text-gray-300">You will be redirected to the resume editor shortly.</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
