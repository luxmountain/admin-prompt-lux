import React from 'react';
import { IRoute } from './types/IRoute';

import {
    IconCamera,
    IconChartBar,
} from "@tabler/icons-react"

const DashboardPage = React.lazy(() => import('@/app/admin/dashboard'));
const LoginPage = React.lazy(() => import('@/app/auth/login'));
const UserListPage = React.lazy(() => import('@/app/admin/userlist'));
const ContentPage = React.lazy(() => import('@/app/admin/content'));
const ReportPage = React.lazy(() => import('@/app/admin/report'));
const ModelPage = React.lazy(() => import('@/app/admin/model'));
const TagPage = React.lazy(() => import('@/app/admin/tag'));
const KeywordPage = React.lazy(() => import('@/app/admin/keyword'));

const routes: IRoute[] = [
  {
    path: '/',
    element: DashboardPage,
    protected: true,
    label: 'Dashboard',
    icon: IconCamera,
    children: [],
    sidebarOrder: 1,
  },
  {
    path: '/users',
    element: UserListPage,
    protected: true,
    label: 'User Management',
    icon: IconCamera,
    children: [],
    sidebarOrder: 2,
  },
  {
    path: '/pins',
    element: ContentPage,
    protected: true,
    label: 'Pin Management',
    icon: IconCamera,
    children: [],
    sidebarOrder: 3,
  },
  {
    path: '/models',
    element: ModelPage,
    protected: true,
    label: 'Model Management',
    icon: IconCamera,
    children: [],
    sidebarOrder: 4,
  },
  {
    path: '/tags',
    element: TagPage,
    protected: true,
    label: 'Tag Management',
    icon: IconCamera,
    children: [],
    sidebarOrder: 5,
  },
  {
    path: '/keywords',
    element: KeywordPage,
    protected: true,
    label: 'Keyword Mangement',
    icon: IconCamera,
    children: [],
    sidebarOrder: 6,
  },
  {
    path: '/reports',
    element: ReportPage,
    protected: true,
    label: 'Report',
    icon: IconCamera,
    children: [],
    sidebarOrder: 7,
  },
  {
    path: '/feedbacks',
    element: ReportPage,
    protected: true,
    label: 'Feedback',
    icon: IconCamera,
    children: [],
    sidebarOrder: 8,
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
