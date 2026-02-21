// src/App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Sidebar from './components/union/Sidebar';
import { PRIVILEGES, FEATURE_MAP } from './api/rolePrivileges';
import { getCurrentUserRole } from './utils/auth';

// Component imports (no conditionals here)
import AcademicDashboard from './components/academic/Dashboard';
import LecturerManagement from './components/academic/LecturerManagement';
import CourseManagement from './components/academic/CourseManagement';
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
import AcademicCalendar from './components/academic/AcademicCalendar';
import ForgetPassword from './components/ForgetPassword';
import ResetPassword from './components/ResetPassword';

const ELEMENTS = {
  TimeTable,
  EventSchedule,
  HallBookings,
  SearchUser,
  AcademicCalendar,
};

function AppWrapper() {
  const location = useLocation();
  const role = getCurrentUserRole();
  const userPrivs = PRIVILEGES[role] || [];

  const isUnionRoute = location.pathname.startsWith('/union') || location.pathname.startsWith('/club');
  const isAcademicRoute = location.pathname.startsWith('/academic');

  // ✅ Sidebar should not render on Home
  const isHome = location.pathname === "/";

  return (
    <>
      {!isHome && isUnionRoute && <Sidebar />}

      <Routes>
        {/* Login + Home */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path='/forgetPassword' element={<ForgetPassword/>}/>
        <Route path="/reset-password" element={<ResetPassword/>} />

        {/* Academic */}
        {role?.startsWith("ACADEMIC") && (
          <>
            <Route path="/academic/dashboard" element={<AcademicDashboard />} />
            <Route path="/academic/lecturers" element={<LecturerManagement />} />
            <Route path="/academic/courses" element={<CourseManagement />} />
          </>
        )}

        {/* Union */}
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

        {/* Privilege-based */}
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
