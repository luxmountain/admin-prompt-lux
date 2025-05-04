import React from 'react';
import { IRoute } from './types/IRoute';

import {
    IconCamera,
    IconChartBar,
} from "@tabler/icons-react"

const DashboardPage = React.lazy(() => import('@/app/admin/dashboard'));
const LoginPage = React.lazy(() => import('@/app/auth/login'));
const UserListPage = React.lazy(() => import('@/app/admin/userlist'));
const ReportPage = React.lazy(() => import('@/app/admin/report'));

const routes: IRoute[] = [
  {
    path: '/',
    element: DashboardPage,
    protected: true,
    label: 'Dashboard',
    icon: IconCamera,
    children: [],
  },
  {
    path: '/users',
    element: UserListPage,
    protected: true,
    label: 'User Management',
    icon: IconCamera,
    children: [],
  },
  {
    path: '/contents',
    element: ReportPage,
    protected: true,
    label: 'Content Management',
    icon: IconCamera,
    children: [],
  },
  {
    path: '/reports',
    element: ReportPage,
    protected: true,
    label: 'Report',
    icon: IconCamera,
    children: [],
  },
  {
    path: '/feedbacks',
    element: ReportPage,
    protected: true,
    label: 'Feedback',
    icon: IconCamera,
    children: [],
  },
  {
    path: '/login',
    element: LoginPage,
    protected: false,
    label: 'Login',
    icon: IconChartBar,
    children: [],
  },
];

export default routes;
