import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import UploadResume from "./pages/UploadResume";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AIResumeMaker from "./pages/AIResumeMaker";
import ResumeEditor from "./pages/ResumeEditor";
import TestDataSetup from "./pages/TestDataSetup";
import GettingStarted from "./pages/GettingStarted";

import { auth } from "./firebase";
import Navbar from "./components/Navbar";
import SetupProfile from "./pages/SetupProfile";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileCompleted, setProfileCompleted] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);

      
      // Check local storage for profile completion status
      if (firebaseUser) {
        const hasCompletedProfile = localStorage.getItem(`profile-completed-${firebaseUser.uid}`);
        setProfileCompleted(hasCompletedProfile === 'true');
      } else {
        setProfileCompleted(false);
      }
      
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-xl font-semibold text-primary-300 animate-pulse">
          Loading<span className="animate-pulse">.</span><span className="animate-pulse delay-100">.</span><span className="animate-pulse delay-200">.</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/setup-profile" />} />
        <Route path="/setup-profile" element={
          <PrivateRoute user={user}>
            <SetupProfile onComplete={() => setProfileCompleted(true)} />
          </PrivateRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute user={user}>
            {user && !profileCompleted ? <Navigate to="/setup-profile" /> : <Dashboard />}
          </PrivateRoute>
        } />
        <Route path="/upload" element={
          <PrivateRoute user={user}>
            {user && !profileCompleted ? <Navigate to="/setup-profile" /> : <UploadResume />}
          </PrivateRoute>
        } />
        <Route path="/ai-resume-maker" element={
          <PrivateRoute user={user}>
            {user && !profileCompleted ? <Navigate to="/setup-profile" /> : <AIResumeMaker />}
          </PrivateRoute>
        } />
        <Route path="/resume-editor" element={
          <PrivateRoute user={user}>
            {user && !profileCompleted ? <Navigate to="/setup-profile" /> : <ResumeEditor />}
          </PrivateRoute>
        } />
        <Route path="/test-data-setup" element={<TestDataSetup />} />
        <Route path="/getting-started" element={<GettingStarted />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

    </Router>
  );
}

function PrivateRoute({ user, children }) {
  console.log("PrivateRoute - user:", user);
  return user ? children : <Navigate to="/login" />;
}

export default App;
