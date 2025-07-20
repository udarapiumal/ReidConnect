import './App.css';
import Login from './components/Login';
// import LostItemForm from './components/union/LostandFound';
import SearchUser from './components/union/SearchUser';
import Sidebar from './components/union/Sidebar'; // Import Navbar
import AcademicDashboard from './components/academic/Dashboard';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import UnionDashboard from './components/union/Dashboard';
import LostItemsGallery from './components/union/LostandFoundPosts';
import LostItemForm from './components/union/LostandFound';
import ClubGallery from './components/union/ClubGallery';
import ClubDetail from './components/union/ClubDetail'; // Import the new ClubDetail component

// Wrapper to conditionally render Navbar
function AppWrapper() {
  const location = useLocation();
  const hideSidebarPaths = ['/']; // Add more paths if needed
  const showSidebar = !hideSidebarPaths.includes(location.pathname);

  return (
    <>
      {showSidebar && <Sidebar/>}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/union/Profilemanagement" element={<SearchUser />} />
        <Route path="/union/LostandFound" element={<LostItemsGallery />} />
        <Route path="/union/LostandFoundForm" element={<LostItemForm/>} />
        <Route path="/union/dashboard" element={<UnionDashboard/>} />
        <Route path="/union/Clubmanagement" element={<ClubGallery/>}/>
        <Route path="/club/:clubId" element={<ClubDetail/>}/> {/* New route for club detail */}
        <Route path="/academic/dashboard" element={<AcademicDashboard />} />
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