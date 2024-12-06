import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/LoginForm';
import { Roulette } from './components/Roulette';
import { Navbar } from './components/Navbar';
import { useAuthStore } from './store/authStore';

function App() {
  const user = useAuthStore((state) => state.user);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Roulette />} />
            <Route
              path="/login"
              element={
                user ? <Navigate to="/dashboard" replace /> : <LoginForm />
              }
            />
            <Route
              path="/dashboard"
              element={
                user ? <Roulette /> : <Navigate to="/login" replace />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;