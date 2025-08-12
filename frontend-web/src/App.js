// src/App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Sidebar from './components/union/Sidebar';
import AcademicSidebar from './components/academic/AcademicSidebar';
import { PRIVILEGES, FEATURE_MAP } from './api/rolePrivileges';
import { getCurrentUserRole } from './utils/auth';

// Component imports (no conditionals here)
import AcademicDashboard from './components/academic/Dashboard';
import LecturerManagement from './components/academic/LecturerManagement';
import CourseManagement from './components/academic/CourseManagement';
import Reports from './components/academic/Reports';
import TimeTable from './components/academic/TimeTable';
import EventSchedule from './components/academic/EventSchedule';
import HallBookings from './components/academic/HallBookings';
import SearchUser from './components/union/SearchUser';
import LostItemsGallery from './components/union/LostandFoundPosts';
import LostItemForm from './components/union/LostandFound';
import UnionDashboard from './components/union/Dashboard';
import ClubGallery from './components/union/ClubGallery';
import ClubDetail from './components/union/ClubDetail';
import EventsPage from './components/union/EventsPage';

const ELEMENTS = {
  TimeTable,
  EventSchedule,
  HallBookings,
  SearchUser
};

function AppWrapper() {
  const location = useLocation();
  const role = getCurrentUserRole();
  const userPrivs = PRIVILEGES[role] || [];

  const isUnionRoute = location.pathname.startsWith('/union') || location.pathname.startsWith('/club');
  const isAcademicRoute = location.pathname.startsWith('/academic');

  return (
    <>
      {isUnionRoute && <Sidebar />}
      {isAcademicRoute && <AcademicSidebar />}

      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Always accessible dashboards */}
        {role?.startsWith("ACADEMIC") && (
          <>
            <Route path="/academic/dashboard" element={<AcademicDashboard />} />
            <Route path="/academic/lecturers" element={<LecturerManagement />} />
            <Route path="/academic/courses" element={<CourseManagement />} />
            <Route path="/academic/reports" element={<Reports />} />
          </>
        )}
        {role === "UNION" && (
          <>
            <Route path="/union/dashboard" element={<UnionDashboard />} />
            <Route path="/union/LostandFound" element={<LostItemsGallery />} />
            <Route path="/union/LostandFoundForm" element={<LostItemForm />} />
            <Route path="/union/Clubmanagement" element={<ClubGallery />} />
            <Route path="/club/:clubId" element={<ClubDetail />} />
            <Route path="/union/events" element={<EventsPage />} />
          </>
        )}

        {/* Privilege-based routes */}
        {userPrivs.map(priv => {
          const feature = FEATURE_MAP[priv];
          if (!feature) return null;
          const Component = ELEMENTS[feature.element];
          return <Route key={feature.route} path={feature.route} element={<Component />} />;
        })}
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
