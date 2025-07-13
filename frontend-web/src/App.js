import './App.css';
import Login from './components/Login';
import LostItemForm from './components/LostandFound';
import SearchUser from './components/SearchUser';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/search" element={<SearchUser />} />
        <Route path="/LostandFound" element={<LostItemForm/>}/>
      </Routes>
    </Router>
  );
}

export default App;
