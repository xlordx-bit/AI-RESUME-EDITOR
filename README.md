# SkillSync - AI-Powered Resume Analytics

SkillSync is a modern web application that provides AI-powered resume analysis and optimization suggestions.

## Features

- 🚀 **Drag & Drop Resume Upload** - Support for PDF, DOC, and DOCX files
- 🤖 **AI-Powered Analysis** - Advanced resume parsing and scoring
- 📊 **ATS Compatibility Check** - Ensures your resume passes Applicant Tracking Systems
- 🎯 **Keyword Extraction** - Identifies technical skills, soft skills, and action verbs
- 💡 **Smart Recommendations** - Actionable suggestions to improve your resume
- 🌙 **Dark Theme UI** - Modern, glassmorphism design with animations

## Quick Start

### Option 1: Automatic Startup (Recommended)

**For Windows:**
```bash
# Double-click the start.bat file, or run in terminal:
start.bat
```

**For Linux/Mac:**
```bash
# Make the script executable and run:
chmod +x start.sh
./start.sh
```

**For Node.js users:**
```bash
# Run both frontend and backend simultaneously:
npm run dev
```

### Option 2: Manual Startup

1. **Start the Backend Server:**
```bash
cd ../server
pip install -r requirements.txt
python app/main.py
```

2. **Start the Frontend (in a new terminal):**
```bash
npm install
npm run frontend
```

## Available Scripts

- `npm run dev` - Start both backend and frontend
- `npm run frontend` - Start only the frontend (Vite dev server)
- `npm run backend` - Start only the backend (Flask server)
- `npm run build` - Build the frontend for production
- `npm run preview` - Preview the production build

## Prerequisites

- **Python 3.10+** - For the backend Flask server
- **Node.js 16+** - For the frontend React application
- **npm** - Package manager for Node.js dependencies

## Backend Connection

The frontend automatically checks backend connectivity on startup and displays:
- 🟢 **Green indicator** - Backend connected and ready
- 🟡 **Yellow indicator** - Connecting to backend
- 🔴 **Red indicator** - Backend disconnected

## Technologies Used

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing

### Backend
- **Flask** - Python web framework
- **PyPDF2** - PDF text extraction
- **python-docx** - Word document processing
- **NLTK** - Natural language processing
- **scikit-learn** - Machine learning

## Troubleshooting

### Backend Not Starting
- Ensure Python 3.10+ is installed
- Install dependencies: `pip install -r requirements.txt`
- Check if port 5000 is available

### Frontend Not Starting
- Ensure Node.js 16+ is installed
- Install dependencies: `npm install`
- Check if port 5173 is available (Vite default)

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
