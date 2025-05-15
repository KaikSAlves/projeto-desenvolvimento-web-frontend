import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { FaBox, FaIceCream, FaComments, FaSignOutAlt} from 'react-icons/fa';
import { VscReport } from "react-icons/vsc";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Verifica se o usuário está autenticado
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Função para verificar se a rota atual está ativa
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Menu Lateral */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Geladinho & Picolé</h1>
          <p className="text-sm text-gray-400">Administrador</p>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => navigate('/admin/estoque')}
                className={`w-full p-3 rounded-lg transition-colors flex items-center gap-3 ${
                  isActiveRoute('/admin/estoque')
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <FaBox className="text-lg" />
                Estoque
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/admin/produtos')}
                className={`w-full p-3 rounded-lg transition-colors flex items-center gap-3 ${
                  isActiveRoute('/admin/produtos')
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <FaIceCream className="text-lg" />
                Produtos
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/admin/feedbacks')}
                className={`w-full p-3 rounded-lg transition-colors flex items-center gap-3 ${
                  isActiveRoute('/admin/feedbacks')
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <FaComments className="text-lg" />
                Feedbacks
              </button>
            </li>
            <button
            onClick={() => navigate('/admin/relatorios')}
            className={`w-full p-3 rounded-lg transition-colors flex items-center gap-3 ${
              isActiveRoute('/admin/relatorios')
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
            >
              <VscReport className="text-lg" />
              Relatórios
            
            </button>
          </ul>
        </nav>

        {/* Botão de Logout */}
        <div className="absolute bottom-0 w-64 p-4">
          <button
            onClick={handleLogout}
            className="w-full p-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors flex items-center justify-center gap-2"
          >
            <FaSignOutAlt />
            Sair
          </button>
        </div>
      </div>

      {/* Área de Conteúdo */}
      <div className="flex-1 overflow-auto p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout; 