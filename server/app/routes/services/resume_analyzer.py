import os
import json
import PyPDF2
import docx
import re
from datetime import datetime
from typing import Dict, List, Any
import nltk
from collections import Counter

class ResumeAnalyzer:
    def __init__(self):
        """Initialize the resume analyzer with required NLTK data"""
        try:
            nltk.download('punkt', quiet=True)
            nltk.download('stopwords', quiet=True)
            nltk.download('averaged_perceptron_tagger', quiet=True)
        except:
            pass  # Handle NLTK download failures gracefully
        
        # Common resume keywords by category
        self.tech_keywords = [
            'python', 'javascript', 'java', 'react', 'node.js', 'sql', 'html', 'css',
            'git', 'docker', 'kubernetes', 'aws', 'azure', 'mongodb', 'postgresql',
            'machine learning', 'data science', 'artificial intelligence', 'api'
        ]
        
        self.soft_skills = [
            'leadership', 'communication', 'teamwork', 'problem solving', 'analytical',
            'creative', 'organized', 'detail-oriented', 'collaborative', 'adaptable'
        ]
        
        self.action_verbs = [
            'achieved', 'developed', 'implemented', 'managed', 'led', 'created',
            'improved', 'increased', 'reduced', 'optimized', 'designed', 'built'
        ]

    def extract_text_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF file"""
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
                return text
        except Exception as e:
            raise Exception(f"Error reading PDF: {str(e)}")

    def extract_text_from_docx(self, file_path: str) -> str:
        """Extract text from DOCX file"""
        try:
            doc = docx.Document(file_path)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text
        except Exception as e:
            raise Exception(f"Error reading DOCX: {str(e)}")

    def extract_text(self, file_path: str, file_type: str) -> str:
        """Extract text from resume file based on type"""
        if file_type.lower() == 'pdf':
            return self.extract_text_from_pdf(file_path)
        elif file_type.lower() in ['doc', 'docx']:
            return self.extract_text_from_docx(file_path)
        else:
            raise Exception(f"Unsupported file type: {file_type}")

    def analyze_keywords(self, text: str) -> Dict[str, Any]:
        """Analyze keywords in the resume text"""
        text_lower = text.lower()
        
        # Find technical keywords
        found_tech_keywords = [kw for kw in self.tech_keywords if kw in text_lower]
        
        # Find soft skills
        found_soft_skills = [skill for skill in self.soft_skills if skill in text_lower]
        
        # Find action verbs
        found_action_verbs = [verb for verb in self.action_verbs if verb in text_lower]
        
        return {
            'technical_keywords': found_tech_keywords,
            'soft_skills': found_soft_skills,
            'action_verbs': found_action_verbs,
            'keyword_count': len(found_tech_keywords) + len(found_soft_skills)
        }

    def analyze_structure(self, text: str) -> Dict[str, Any]:
        """Analyze resume structure and sections"""
        sections = {
            'contact': bool(re.search(r'(email|phone|linkedin|github)', text, re.IGNORECASE)),
            'summary': bool(re.search(r'(summary|objective|profile)', text, re.IGNORECASE)),
            'experience': bool(re.search(r'(experience|work|employment)', text, re.IGNORECASE)),
            'education': bool(re.search(r'(education|degree|university|college)', text, re.IGNORECASE)),
            'skills': bool(re.search(r'(skills|technologies|technical)', text, re.IGNORECASE))
        }
        
        # Count bullet points (indicators of good formatting)
        bullet_points = len(re.findall(r'[•·‣▪▫◦‣]', text))
        
        return {
            'sections_present': sections,
            'section_count': sum(sections.values()),
            'bullet_points': bullet_points,
            'word_count': len(text.split()),
            'has_quantifiable_achievements': bool(re.search(r'\d+%|\$\d+|\d+\+', text))
        }

    def calculate_ats_score(self, text: str, keywords: Dict[str, Any]) -> int:
        """Calculate ATS compatibility score"""
        score = 0
        
        # Keyword density (30 points)
        if keywords['keyword_count'] >= 15:
            score += 30
        elif keywords['keyword_count'] >= 10:
            score += 20
        elif keywords['keyword_count'] >= 5:
            score += 10
        
        # Standard sections (25 points)
        structure = self.analyze_structure(text)
        score += structure['section_count'] * 5
        
        # Formatting indicators (20 points)
        if structure['bullet_points'] > 0:
            score += 10
        if structure['has_quantifiable_achievements']:
            score += 10
        
        # Text length (15 points)
        word_count = len(text.split())
        if 400 <= word_count <= 800:
            score += 15
        elif 300 <= word_count <= 1000:
            score += 10
        
        # Action verbs (10 points)
        if len(keywords['action_verbs']) >= 5:
            score += 10
        elif len(keywords['action_verbs']) >= 3:
            score += 5
        
        return min(score, 100)

    def generate_recommendations(self, text: str, keywords: Dict[str, Any], structure: Dict[str, Any]) -> List[str]:
        """Generate improvement recommendations"""
        recommendations = []
        
        if keywords['keyword_count'] < 10:
            recommendations.append("Add more relevant industry keywords to improve ATS compatibility")
        
        if len(keywords['action_verbs']) < 3:
            recommendations.append("Use more action verbs to describe your achievements")
        
        if not structure['has_quantifiable_achievements']:
            recommendations.append("Include quantifiable metrics and achievements (percentages, dollar amounts, etc.)")
        
        if structure['word_count'] < 300:
            recommendations.append("Expand your resume content - it appears too brief")
        elif structure['word_count'] > 1000:
            recommendations.append("Consider condensing your resume - it may be too lengthy")
        
        if structure['bullet_points'] < 5:
            recommendations.append("Use bullet points to improve readability and structure")
        
        missing_sections = [section for section, present in structure['sections_present'].items() if not present]
        if missing_sections:
            recommendations.append(f"Consider adding these sections: {', '.join(missing_sections)}")
        
        return recommendations

    def analyze_resume(self, file_path: str, file_type: str) -> Dict[str, Any]:
        """Main analysis function"""
        try:
            # Extract text
            text = self.extract_text(file_path, file_type)
            
            # Perform various analyses
            keywords = self.analyze_keywords(text)
            structure = self.analyze_structure(text)
            ats_score = self.calculate_ats_score(text, keywords)
            recommendations = self.generate_recommendations(text, keywords, structure)
            
            # Calculate overall score
            overall_score = int((
                (len(keywords['technical_keywords']) * 3) +
                (len(keywords['soft_skills']) * 2) +
                (len(keywords['action_verbs']) * 2) +
                (structure['section_count'] * 5) +
                (ats_score * 0.3)
            ) / 2)
            
            overall_score = min(max(overall_score, 0), 100)
            
            return {
                'overall_score': overall_score,
                'ats_compatibility': ats_score,
                'keywords': {
                    'technical': keywords['technical_keywords'],
                    'soft_skills': keywords['soft_skills'],
                    'action_verbs': keywords['action_verbs'],
                    'total_count': keywords['keyword_count']
                },
                'structure': {
                    'sections': structure['sections_present'],
                    'word_count': structure['word_count'],
                    'bullet_points': structure['bullet_points'],
                    'has_metrics': structure['has_quantifiable_achievements']
                },
                'recommendations': recommendations,
                'analysis_date': datetime.now().isoformat(),
                'file_type': file_type
            }
            
        except Exception as e:
            raise Exception(f"Resume analysis failed: {str(e)}")

    def detailed_analysis(self, file_id: str) -> Dict[str, Any]:
        """Perform detailed analysis on uploaded file"""
        # This would be implemented to work with actual uploaded files
        # For now, return enhanced mock data
        return {
            'overall_score': 85,
            'ats_compatibility': 82,
            'detailed_feedback': {
                'strengths': [
                    "Strong technical vocabulary",
                    "Well-structured experience section",
                    "Good use of action verbs"
                ],
                'weaknesses': [
                    "Missing quantifiable achievements",
                    "Could improve keyword density",
                    "Add more recent technologies"
                ]
            },
            'section_scores': {
                'contact_info': 95,
                'summary': 78,
                'experience': 85,
                'education': 90,
                'skills': 80
            },
            'keyword_analysis': {
                'found_keywords': ["Python", "JavaScript", "React", "SQL"],
                'suggested_keywords': ["Node.js", "AWS", "Docker", "Git"],
                'keyword_density': "Optimal"
            }
        }
