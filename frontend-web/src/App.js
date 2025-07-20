import './App.css';
import Login from './components/Login';
import LostItemForm from './components/union/LostandFound';
import SearchUser from './components/union/SearchUser';
import Sidebar from './components/union/Sidebar'; // Import Navbar
import AcademicDashboard from './components/academic/Dashboard';
import LecturerManagement from './components/academic/LecturerManagement';
import EventSchedule from './components/academic/EventSchedule';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import UnionDashboard from './components/union/Dashboard';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Wrapper to conditionally render Navbar
function AppWrapper() {
  const location = useLocation();
  const hideSidebarPaths = ['/', '/academic/dashboard', '/academic/lecturers', '/academic/events']; // Add more paths if needed
  const showSidebar = !hideSidebarPaths.includes(location.pathname);

  return (
    <>
      {showSidebar && <Sidebar/>}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/union/Profilemanagement" element={<SearchUser />} />
        <Route path="/union/LostandFound" element={<LostItemForm />} />
        <Route path="/union/dashboard" element={<UnionDashboard/>} />
        <Route path="/academic/dashboard" element={<AcademicDashboard />} />
        <Route path="/academic/lecturers" element={<LecturerManagement />} />
        <Route path="/academic/events" element={<EventSchedule />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
