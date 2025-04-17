import { createBrowserRouter } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminProdutos from '../pages/admin/AdminProdutos';
import AdminEstoque from '../pages/admin/AdminEstoque';
import AdminFeedbacks from '../pages/admin/AdminFeedbacks';

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
      }
    ]
  }
]);

export default router; 