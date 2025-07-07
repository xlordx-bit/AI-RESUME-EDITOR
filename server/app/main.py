from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from werkzeug.utils import secure_filename
from datetime import datetime
import uuid

# Import our resume analysis modules
from routes.resume_analysis import resume_bp
from routes.services.resume_analyzer import ResumeAnalyzer

app = Flask(__name__)
CORS(app)

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}

# Create upload directory if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize resume analyzer
analyzer = ResumeAnalyzer()

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def home():
    return jsonify({
        "message": "SkillSync Resume Analytics API",
        "version": "1.0.0",
        "endpoints": {
            "upload": "/api/upload",
            "analyze": "/api/analyze",
            "results": "/api/results",
            "generate_resume": "/api/generate-resume",
            "download_generated": "/api/download-generated",
            "health": "/api/health"
        }
    })

@app.route('/api/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "analyzer": "active",
            "storage": "active"
        }
    })

@app.route('/api/upload', methods=['POST'])
def upload_resume():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        user_id = request.form.get('userId', 'anonymous')
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Only PDF, DOC, DOCX allowed'}), 400
        
        # Generate unique filename
        file_id = str(uuid.uuid4())
        filename = secure_filename(file.filename)
        file_extension = filename.rsplit('.', 1)[1].lower()
        stored_filename = f"{file_id}.{file_extension}"
        
        # Save file
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], stored_filename)
        file.save(file_path)
        
        # Create file metadata
        file_metadata = {
            'file_id': file_id,
            'original_name': filename,
            'stored_name': stored_filename,
            'user_id': user_id,
            'upload_date': datetime.now().isoformat(),
            'file_size': os.path.getsize(file_path),
            'file_type': file_extension,
            'status': 'uploaded'
        }
        
        # Save metadata
        metadata_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{file_id}_metadata.json")
        with open(metadata_path, 'w') as f:
            json.dump(file_metadata, f, indent=2)
        
        return jsonify({
            'message': 'File uploaded successfully',
            'file_id': file_id,
            'metadata': file_metadata
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Upload failed: {str(e)}'}), 500

@app.route('/api/analyze/<file_id>', methods=['GET'])
def analyze_resume(file_id):
    try:
        # Load file metadata
        metadata_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{file_id}_metadata.json")
        
        if not os.path.exists(metadata_path):
            return jsonify({'error': 'File not found'}), 404
        
        with open(metadata_path, 'r') as f:
            metadata = json.load(f)
        
        # Get file path
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], metadata['stored_name'])
        
        if not os.path.exists(file_path):
            return jsonify({'error': 'Resume file not found'}), 404
        
        # Analyze resume
        analysis_result = analyzer.analyze_resume(file_path, metadata['file_type'])
        
        # Save analysis results
        analysis_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{file_id}_analysis.json")
        with open(analysis_path, 'w') as f:
            json.dump(analysis_result, f, indent=2)
        
        # Update metadata
        metadata['status'] = 'analyzed'
        metadata['analysis_date'] = datetime.now().isoformat()
        
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        return jsonify({
            'message': 'Analysis completed successfully',
            'file_id': file_id,
            'analysis': analysis_result
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

@app.route('/api/results/<file_id>', methods=['GET'])
def get_analysis_results(file_id):
    try:
        analysis_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{file_id}_analysis.json")
        
        if not os.path.exists(analysis_path):
            return jsonify({'error': 'Analysis results not found'}), 404
        
        with open(analysis_path, 'r') as f:
            analysis_result = json.load(f)
        
        return jsonify({
            'file_id': file_id,
            'analysis': analysis_result
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve results: {str(e)}'}), 500

@app.route('/api/generate-resume', methods=['POST'])
def generate_resume():
    """Generate a resume using AI based on provided data"""
    try:
        data = request.json
        
        # Validate required data
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Generate unique ID for this resume
        resume_id = str(uuid.uuid4())
        
        # For now, we'll create a mock AI-generated resume
        # In a real implementation, you would integrate with an AI service like OpenAI
        generated_content = {
            'id': resume_id,
            'personalInfo': data.get('personalInfo', {}),
            'summary': f"Experienced professional with expertise in {', '.join(data.get('skills', [])[:3])}. Proven track record in delivering high-quality results and driving business growth.",
            'experience': data.get('experience', []),
            'education': data.get('education', []),
            'skills': data.get('skills', []),
            'projects': data.get('projects', []),
            'certifications': data.get('certifications', []),
            'generated_at': datetime.now().isoformat(),
            'template': 'professional'
        }
        
        # Save the generated resume
        resume_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{resume_id}_generated_resume.json")
        with open(resume_path, 'w') as f:
            json.dump(generated_content, f, indent=2)
        
        return jsonify({
            'success': True,
            'resume_id': resume_id,
            'message': 'Resume generated successfully',
            'resume': generated_content
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to generate resume: {str(e)}'}), 500

@app.route('/api/download-generated/<resume_id>')
def download_generated_resume(resume_id):
    """Download the generated resume as PDF"""
    try:
        resume_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{resume_id}_generated_resume.json")
        
        if not os.path.exists(resume_path):
            return jsonify({'error': 'Generated resume not found'}), 404
        
        with open(resume_path, 'r') as f:
            resume_data = json.load(f)
        
        # For now, return the JSON data
        # In a real implementation, you would generate a PDF and return it
        return jsonify({
            'success': True,
            'resume_id': resume_id,
            'download_url': f'/api/resume-pdf/{resume_id}',
            'resume_data': resume_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to download resume: {str(e)}'}), 500

# Register blueprints
app.register_blueprint(resume_bp, url_prefix='/api')

if __name__ == '__main__':
    print("Starting SkillSync Resume Analytics Server...")
    print("Available endpoints:")
    print("  - POST /api/upload - Upload resume file")
    print("  - GET /api/analyze/<file_id> - Analyze uploaded resume")
    print("  - GET /api/results/<file_id> - Get analysis results")
    print("  - POST /api/generate-resume - Generate AI resume")
    print("  - GET /api/download-generated/<resume_id> - Download generated resume")
    print("  - GET /api/health - Health check")
    app.run(debug=True, host='0.0.0.0', port=5000)