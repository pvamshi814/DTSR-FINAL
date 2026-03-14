import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './index.css';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DegreeSelection from './pages/DegreeSelection';
import DomainSelection from './pages/DomainSelection';
import DifficultySelection from './pages/DifficultySelection';
import InterviewPage from './pages/InterviewPage';
import FeedbackPage from './pages/FeedbackPage';
import Dashboard from './pages/Dashboard';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/select-degree" element={<DegreeSelection />} />
          <Route path="/select-domain" element={<DomainSelection />} />
          <Route path="/select-difficulty" element={<DifficultySelection />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/feedback/:interviewId" element={<FeedbackPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
