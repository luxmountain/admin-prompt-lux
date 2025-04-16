import React from 'react';
import { IRoute } from './types/IRoute';

import {
    IconCamera,
    IconChartBar,
} from "@tabler/icons-react"

const DashboardPage = React.lazy(() => import('@/app/admin/dashboard'));
const LoginPage = React.lazy(() => import('@/app/auth/login'));

const routes: IRoute[] = [
  {
    path: '/',
    element: DashboardPage,
    protected: true, // Cần xác thực
    label: 'Dashboard',
    icon: IconCamera,
    children: [],
  },
  
  {
    path: '/login',
    element: LoginPage,
    protected: false, // Không yêu cầu xác thực
    label: 'Đăng nhập',
    icon: IconChartBar,
    children: [],
  },

];

export default routes;
