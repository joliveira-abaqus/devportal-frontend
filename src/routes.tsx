import { Navigate, createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/pages/DashboardLayout';
import DashboardPage from '@/pages/DashboardPage';
import LoginPage from '@/pages/LoginPage';
import NewRequestPage from '@/pages/NewRequestPage';
import RegisterPage from '@/pages/RegisterPage';
import RequestDetailPage from '@/pages/RequestDetailPage';
import RootLayout from '@/pages/RootLayout';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <Navigate to="/login" replace /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardLayout />,
            children: [{ index: true, element: <DashboardPage /> }],
          },
          { path: '/requests/new', element: <NewRequestPage /> },
          { path: '/requests/:id', element: <RequestDetailPage /> },
        ],
      },
    ],
  },
]);
