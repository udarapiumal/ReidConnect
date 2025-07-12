import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AcademicAdminPage from './pages/academic-admin/AcademicAdminPage';

// ...other imports

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* ...other routes */}
        <Route
          path="/academic-admin"
          element={
            <ProtectedRoute>
              <AcademicAdminPage />
            </ProtectedRoute>
          }
        />
        {/* ...other routes */}
      </Routes>
    </Router>
  );
}

export default AppRoutes;