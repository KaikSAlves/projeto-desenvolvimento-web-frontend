import { createBrowserRouter } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminProdutos from '../pages/admin/AdminProdutos';
import AdminEstoque from '../pages/admin/AdminEstoque';
import AdminFeedbacks from '../pages/admin/AdminFeedbacks';
import AdminRelatorios from '../pages/admin/AdminRelatorios';

const router = createBrowserRouter([
  {
    path: '/admin/login',
    element: <AdminLogin />
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'produtos',
        element: <AdminProdutos />
      },
      {
        path: 'estoque',
        element: <AdminEstoque />
      },
      {
        path: 'feedbacks',
        element: <AdminFeedbacks />
      },
      {
        path: 'relatorios',
        element: <AdminRelatorios />
      }
    ]
  }
]);

export default router; 