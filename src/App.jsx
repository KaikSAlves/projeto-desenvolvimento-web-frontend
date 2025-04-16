import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-pink-50">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<div>Admin Dashboard (em breve)</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;