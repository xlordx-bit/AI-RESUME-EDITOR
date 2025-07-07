from flask import Blueprint, request, jsonify
from .services.resume_analyzer import ResumeAnalyzer
from .services.ats_checker import ATSChecker
from .services.keyword_extractor import KeywordExtractor
import os
import json
from datetime import datetime

resume_bp = Blueprint('resume', __name__)

# Initialize services
analyzer = ResumeAnalyzer()
ats_checker = ATSChecker()
keyword_extractor = KeywordExtractor()

@resume_bp.route('/resume/quick-analyze', methods=['POST'])
def quick_analyze():
    """Quick analysis endpoint for demo purposes"""
    try:
        data = request.get_json()
        
        if not data or 'fileName' not in data:
            return jsonify({'error': 'Missing file name'}), 400
        
        file_name = data['fileName']
        
        # Simulate analysis based on file type and name
        mock_analysis = generate_mock_analysis(file_name)
        
        return jsonify({
            'success': True,
            'analysis': mock_analysis,
            'timestamp': datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Quick analysis failed: {str(e)}'}), 500

@resume_bp.route('/resume/detailed-analyze', methods=['POST'])
def detailed_analyze():
    """Detailed analysis with actual file processing"""
    try:
        file_id = request.json.get('fileId')
        
        if not file_id:
            return jsonify({'error': 'File ID required'}), 400
        
        # Process the actual file
        analysis_result = analyzer.detailed_analysis(file_id)
        
        return jsonify({
            'success': True,
            'analysis': analysis_result,
            'timestamp': datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Detailed analysis failed: {str(e)}'}), 500

@resume_bp.route('/resume/ats-check', methods=['POST'])
def ats_compatibility_check():
    """Check ATS compatibility of resume"""
    try:
        file_id = request.json.get('fileId')
        job_description = request.json.get('jobDescription', '')
        
        if not file_id:
            return jsonify({'error': 'File ID required'}), 400
        
        ats_score = ats_checker.check_compatibility(file_id, job_description)
        
        return jsonify({
            'success': True,
            'ats_score': ats_score,
            'timestamp': datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'ATS check failed: {str(e)}'}), 500

@resume_bp.route('/resume/keywords', methods=['POST'])
def extract_keywords():
    """Extract keywords from resume"""
    try:
        file_id = request.json.get('fileId')
        
        if not file_id:
            return jsonify({'error': 'File ID required'}), 400
        
        keywords = keyword_extractor.extract_keywords(file_id)
        
        return jsonify({
            'success': True,
            'keywords': keywords,
            'timestamp': datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Keyword extraction failed: {str(e)}'}), 500

def generate_mock_analysis(file_name):
    """Generate realistic mock analysis results"""
    
    # Base scores that vary slightly
    base_scores = {
        'pdf': {'overall': 82, 'ats': 88},
        'doc': {'overall': 76, 'ats': 82},
        'docx': {'overall': 79, 'ats': 85}
    }
    
    file_ext = file_name.split('.')[-1].lower() if '.' in file_name else 'pdf'
    scores = base_scores.get(file_ext, base_scores['pdf'])
    
    # Determine skill level from filename
    tech_keywords = ['developer', 'engineer', 'programmer', 'analyst', 'architect']
    is_tech = any(keyword in file_name.lower() for keyword in tech_keywords)
    
    if is_tech:
        skills = ["JavaScript", "React", "Node.js", "Python", "SQL", "Git", "AWS", "Docker"]
        strengths = [
            "Strong technical skills section",
            "Relevant programming experience",
            "Clear project descriptions",
            "Good use of technical keywords"
        ]
        improvements = [
            "Add more quantifiable achievements",
            "Include metrics for project impact",
            "Expand on leadership experience",
            "Add certifications section"
        ]
    else:
        skills = ["Communication", "Project Management", "Leadership", "Analysis", "Strategy"]
        strengths = [
            "Strong communication skills",
            "Relevant work experience",
            "Clear formatting and structure",
            "Good use of action verbs"
        ]
        improvements = [
            "Add more quantifiable results",
            "Include relevant industry keywords",
            "Expand on achievements",
            "Add skills section"
        ]
    
    return {
        'overallScore': scores['overall'],
        'atsCompatibility': scores['ats'],
        'strengths': strengths,
        'improvements': improvements,
        'keywords': skills,
        'sections': {
            'contact': {'score': 95, 'feedback': 'Complete contact information'},
            'summary': {'score': 78, 'feedback': 'Good summary, could be more targeted'},
            'experience': {'score': 85, 'feedback': 'Strong experience section'},
            'education': {'score': 90, 'feedback': 'Well formatted education'},
            'skills': {'score': 80, 'feedback': 'Good skills list, add more keywords'}
        },
        'recommendations': [
            "Use more action verbs in experience descriptions",
            "Add quantifiable metrics to achievements",
            "Include relevant industry keywords",
            "Optimize for ATS scanning"
        ],
        'readabilityScore': 82,
        'keywordDensity': 'Optimal',
        'formatScore': 88
    }
