import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForms from './components/AuthForms';
import FoodPage from './components/FoodPage';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleStorage = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <Router>
      <Routes>
        <Route 
          path="/authenticate" 
          element={!isAuthenticated ? <AuthForms setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/" 
          element={isAuthenticated ? <FoodPage /> : <Navigate to="/authenticate" replace />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
