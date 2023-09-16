import { authRoles } from 'app/auth/authRoles';
import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const AppAlert = Loadable(lazy(() => import('./alert/AppAlert')));

const alertsRoute = [{ path: '/alerts', element: <AppAlert />, auth: authRoles.editor }];

export default alertsRoute;
