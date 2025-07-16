import './App.css';
import Login from './components/Login';
import LostItemForm from './components/LostandFound';
import SearchUser from './components/SearchUser';
import Navbar from './components/Navbar/Navbar'; // Import Navbar
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Wrapper to conditionally render Navbar
function AppWrapper() {
  const location = useLocation();
  const showNavbar = location.pathname !== '/';

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/search" element={<SearchUser />} />
        <Route path="/LostandFound" element={<LostItemForm />} />
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
