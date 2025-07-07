from typing import Dict, List, Any
import re
from collections import Counter

class ATSChecker:
    def __init__(self):
        """Initialize ATS checker with common ATS criteria"""
        self.ats_friendly_fonts = [
            'arial', 'calibri', 'times new roman', 'helvetica', 'georgia'
        ]
        
        self.problematic_elements = [
            'tables', 'text boxes', 'headers', 'footers', 'graphics',
            'special characters', 'fancy formatting'
        ]
        
        self.recommended_sections = [
            'contact information', 'professional summary', 'work experience',
            'education', 'skills', 'certifications'
        ]

    def check_keyword_optimization(self, text: str, job_description: str = "") -> Dict[str, Any]:
        """Check keyword optimization against job description"""
        if not job_description:
            # Use general keywords if no job description provided
            job_keywords = [
                'experience', 'skills', 'management', 'development',
                'analysis', 'project', 'team', 'leadership'
            ]
        else:
            # Extract keywords from job description
            job_keywords = self.extract_job_keywords(job_description)
        
        text_lower = text.lower()
        found_keywords = [kw for kw in job_keywords if kw in text_lower]
        
        keyword_score = (len(found_keywords) / len(job_keywords)) * 100 if job_keywords else 0
        
        return {
            'keyword_match_score': min(keyword_score, 100),
            'found_keywords': found_keywords,
            'missing_keywords': [kw for kw in job_keywords if kw not in found_keywords],
            'total_job_keywords': len(job_keywords)
        }

    def extract_job_keywords(self, job_description: str) -> List[str]:
        """Extract relevant keywords from job description"""
        # Simple keyword extraction - can be enhanced with NLP
        common_keywords = [
            'python', 'javascript', 'java', 'react', 'node.js', 'sql',
            'management', 'leadership', 'analysis', 'development',
            'project management', 'communication', 'teamwork'
        ]
        
        job_desc_lower = job_description.lower()
        found_keywords = [kw for kw in common_keywords if kw in job_desc_lower]
        
        return found_keywords

    def check_formatting(self, text: str) -> Dict[str, Any]:
        """Check ATS-friendly formatting"""
        formatting_score = 100
        issues = []
        
        # Check for special characters that might cause issues
        special_chars = re.findall(r'[^\w\s\-\.\,\:\;\(\)\[\]]', text)
        if len(special_chars) > 10:
            formatting_score -= 10
            issues.append("Too many special characters detected")
        
        # Check for proper section headers
        section_headers = re.findall(r'^[A-Z\s]{3,}$', text, re.MULTILINE)
        if len(section_headers) < 3:
            formatting_score -= 15
            issues.append("Missing clear section headers")
        
        # Check for consistent formatting
        bullet_points = len(re.findall(r'[•·‣▪▫◦‣]', text))
        if bullet_points == 0:
            formatting_score -= 10
            issues.append("No bullet points found - consider using them for better readability")
        
        return {
            'formatting_score': max(formatting_score, 0),
            'issues': issues,
            'recommendations': self.get_formatting_recommendations(issues)
        }

    def get_formatting_recommendations(self, issues: List[str]) -> List[str]:
        """Generate formatting recommendations based on issues"""
        recommendations = []
        
        if "special characters" in str(issues):
            recommendations.append("Remove excessive special characters and symbols")
        
        if "section headers" in str(issues):
            recommendations.append("Add clear, uppercase section headers (e.g., EXPERIENCE, EDUCATION)")
        
        if "bullet points" in str(issues):
            recommendations.append("Use bullet points to organize information clearly")
        
        recommendations.extend([
            "Use standard fonts like Arial, Calibri, or Times New Roman",
            "Avoid tables, text boxes, and graphics",
            "Keep formatting simple and clean",
            "Use consistent spacing and alignment"
        ])
        
        return recommendations

    def check_length_and_structure(self, text: str) -> Dict[str, Any]:
        """Check resume length and structure"""
        word_count = len(text.split())
        page_estimate = word_count / 250  # Rough estimate
        
        length_score = 100
        structure_issues = []
        
        # Check length
        if word_count < 200:
            length_score -= 30
            structure_issues.append("Resume too short - may lack sufficient detail")
        elif word_count > 1200:
            length_score -= 20
            structure_issues.append("Resume too long - consider condensing")
        
        # Check for contact information
        if not re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text):
            length_score -= 20
            structure_issues.append("No email address found")
        
        # Check for phone number
        if not re.search(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text):
            length_score -= 10
            structure_issues.append("No phone number found")
        
        return {
            'length_score': max(length_score, 0),
            'word_count': word_count,
            'estimated_pages': round(page_estimate, 1),
            'structure_issues': structure_issues
        }

    def check_compatibility(self, file_id: str, job_description: str = "") -> Dict[str, Any]:
        """Main ATS compatibility check function"""
        # For demo purposes, return mock data
        # In real implementation, this would load and analyze the actual file
        
        mock_text = """
        John Doe
        john.doe@email.com
        (555) 123-4567
        
        PROFESSIONAL SUMMARY
        Experienced software developer with 5+ years in web development.
        
        EXPERIENCE
        Senior Developer - Tech Company (2020-2023)
        • Developed web applications using React and Node.js
        • Led team of 3 developers
        • Improved application performance by 40%
        
        EDUCATION
        Bachelor of Computer Science - University XYZ
        
        SKILLS
        Python, JavaScript, React, Node.js, SQL, Git
        """
        
        keyword_analysis = self.check_keyword_optimization(mock_text, job_description)
        formatting_analysis = self.check_formatting(mock_text)
        structure_analysis = self.check_length_and_structure(mock_text)
        
        # Calculate overall ATS score
        overall_score = (
            keyword_analysis['keyword_match_score'] * 0.4 +
            formatting_analysis['formatting_score'] * 0.3 +
            structure_analysis['length_score'] * 0.3
        )
        
        return {
            'overall_ats_score': round(overall_score, 1),
            'keyword_analysis': keyword_analysis,
            'formatting_analysis': formatting_analysis,
            'structure_analysis': structure_analysis,
            'recommendations': [
                "Optimize keywords based on job description",
                "Use simple, clean formatting",
                "Include all essential contact information",
                "Keep resume between 1-2 pages"
            ],
            'ats_friendly': overall_score >= 70
        }
