import AuthGuard from 'app/auth/AuthGuard';
import chartsRoute from 'app/views/charts/ChartsRoute';
import dashboardRoutes from 'app/views/dashboard/DashboardRoutes';
import materialRoutes from 'app/views/material-kit/MaterialRoutes';
import alertsRoute from './views/alerts/AlertsRoute';
import NotFound from 'app/views/sessions/NotFound';
import { Navigate } from 'react-router-dom';
import MatxLayout from './components/MatxLayout/MatxLayout';

const routes = [
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [...dashboardRoutes, ...alertsRoute, ...chartsRoute, ...materialRoutes],
  },
  // ...sessionRoutes,
  { path: '/', element: <Navigate to="/charts" /> },

  { path: '*', element: <NotFound /> },
];

export default routes;
