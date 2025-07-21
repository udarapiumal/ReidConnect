import './App.css';
import Login from './components/Login';
import SearchUser from './components/union/SearchUser';
import Sidebar from './components/union/Sidebar';
import AcademicDashboard from './components/academic/Dashboard';
import LecturerManagement from './components/academic/LecturerManagement';
import CourseManagement from './components/academic/CourseManagement';
import EventSchedule from './components/academic/EventSchedule';
import HallBookings from './components/academic/HallBookings';
import Reports from './components/academic/Reports';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import UnionDashboard from './components/union/Dashboard';
import LostItemsGallery from './components/union/LostandFoundPosts';
import LostItemForm from './components/union/LostandFound';
import ClubGallery from './components/union/ClubGallery';
import ClubDetail from './components/union/ClubDetail';
import AcademicSidebar from './components/academic/AcademicSidebar';

function AppWrapper() {
  const location = useLocation();

  // Detect current section
  const isUnionRoute = location.pathname.startsWith('/union') || location.pathname.startsWith('/club');
  const isAcademicRoute = location.pathname.startsWith('/academic');

  return (
    <>
      {/* Conditionally render sidebars */}
      {isUnionRoute && <Sidebar />}
      {isAcademicRoute && <AcademicSidebar />}

      {/* Routes */}
      <Routes>
        {/* Common Routes */}
        <Route path="/" element={<Login />} />

        {/* Union Routes */}
        <Route path="/union/Profilemanagement" element={<SearchUser />} />
        <Route path="/union/LostandFound" element={<LostItemsGallery />} />
        <Route path="/union/LostandFoundForm" element={<LostItemForm />} />
        <Route path="/union/dashboard" element={<UnionDashboard />} />
        <Route path="/union/Clubmanagement" element={<ClubGallery />} />
        <Route path="/club/:clubId" element={<ClubDetail />} />

        {/* Academic Routes */}
        <Route path="/academic/dashboard" element={<AcademicDashboard />} />
        <Route path="/academic/lecturers" element={<LecturerManagement />} />
        <Route path="/academic/courses" element={<CourseManagement />} />
        <Route path="/academic/events" element={<EventSchedule />} />
        <Route path="/academic/bookings" element={<HallBookings />} />
        <Route path="/academic/reports" element={<Reports />} />
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