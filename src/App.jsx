import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/AdminLayout';
import AdminEstoque from './pages/admin/AdminEstoque';
import AdminProdutos from './pages/admin/AdminProdutos';
import AdminFeedbacks from './pages/admin/AdminFeedbacks';

// Componente de proteção de rota
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('adminAuthenticated');
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-pink-50">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/estoque" replace />} />
            <Route path="estoque" element={<AdminEstoque />} />
            <Route path="produtos" element={<AdminProdutos />} />
            <Route path="feedbacks" element={<AdminFeedbacks />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;