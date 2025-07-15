import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// ...other imports

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* ...other routes */}
        
        {/* Academic admin routes completely removed */}
        
        {/* ...other routes */}
      </Routes>
    </Router>
  );
}

export default AppRoutes;