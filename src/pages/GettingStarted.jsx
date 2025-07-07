import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaRocket, FaCheckCircle, FaArrowRight } from 'react-icons/fa';

export default function GettingStarted() {
  const navigate = useNavigate();

  const steps = [
    {
      title: "Set up Sample Data",
      description: "Click below to populate the app with sample resume data for testing",
      action: () => navigate('/test-data-setup'),
      buttonText: "Setup Sample Data",
      icon: FaRocket
    },
    {
      title: "Create Your Resume",
      description: "Use our AI-powered resume builder to create a professional resume",
      action: () => navigate('/ai-resume-maker'),
      buttonText: "AI Resume Maker",
      icon: FaCheckCircle
    },
    {
      title: "Edit Your Resume",
      description: "Fine-tune your resume with our advanced editor",
      action: () => navigate('/resume-editor'),
      buttonText: "Resume Editor",
      icon: FaArrowRight
    }
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold gradient-text-vibrant mb-4">
            Welcome to SkillSync!
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Get started with your AI-powered resume builder. Follow these steps to create your perfect resume.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-dark-800 p-6 rounded-lg border border-dark-700 hover:border-primary-600 transition-all duration-300"
            >
              <div className="text-center">
                <step.icon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-300 mb-6">
                  {step.description}
                </p>
                <button
                  onClick={step.action}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full"
                >
                  {step.buttonText}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 bg-dark-800 p-6 rounded-lg border border-dark-700"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Quick Start Tips</h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <FaCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Start by setting up sample data to see how the app works</span>
            </li>
            <li className="flex items-start gap-3">
              <FaCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Use the AI Resume Maker to create a tailored resume based on job descriptions</span>
            </li>
            <li className="flex items-start gap-3">
              <FaCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Edit and customize your resume with our intuitive editor</span>
            </li>
            <li className="flex items-start gap-3">
              <FaCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Download your resume as PDF when you're satisfied</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
