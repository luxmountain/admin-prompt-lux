import React from 'react';
import { IRoute } from './types/IRoute';

import {
  IconLayoutDashboard,
  IconUsers,
  IconPinned,
  IconRobot,
  IconTags,
  IconKey,
  IconFlag,
  IconLogin,
} from "@tabler/icons-react";

const DashboardPage = React.lazy(() => import('@/app/admin/dashboard'));
const LoginPage = React.lazy(() => import('@/app/auth/login'));
const UserListPage = React.lazy(() => import('@/app/admin/userlist'));
const ContentPage = React.lazy(() => import('@/app/admin/content'));
const ReportPage = React.lazy(() => import('@/app/admin/report'));
const ModelPage = React.lazy(() => import('@/app/admin/model'));
const TagPage = React.lazy(() => import('@/app/admin/tag'));
const KeywordPage = React.lazy(() => import('@/app/admin/keyword'));
const AccountPage = React.lazy(() => import('@/app/admin/account'));
const AddTagPage = React.lazy(() => import('@/app/admin/add/tag'));
const EditTagPage = React.lazy(() => import('@/app/admin/edit/tag'));
const EditModelPage = React.lazy(() => import('@/app/admin/edit/model'));
const AddModelPage = React.lazy(() => import('@/app/admin/add/model'));
const UserViewPage = React.lazy(() => import('@/app/view/user'));
const PinViewPage = React.lazy(() => import('@/app/view/pin'));

const routes: IRoute[] = [
  {
    path: '/',
    element: DashboardPage,
    protected: true,
    label: 'Dashboard',
    icon: IconLayoutDashboard,
    children: [],
    sidebarOrder: 1,
  },
  {
    path: '/users',
    element: UserListPage,
    protected: true,
    label: 'User Management',
    icon: IconUsers,
    children: [],
    sidebarOrder: 2,
  },
  {
    path: '/pins',
    element: ContentPage,
    protected: true,
    label: 'Pin Management',
    icon: IconPinned,
    children: [],
    sidebarOrder: 3,
  },
  {
    path: '/models',
    element: ModelPage,
    protected: true,
    label: 'Model Management',
    icon: IconRobot,
    children: [
      {
        path: 'create',
        element: AddModelPage,
        protected: true,
        label: 'Create Model',
        icon: IconFlag,
        children: [],
      },
      {
        path: 'edit/:id',
        element: EditModelPage,
        protected: true,
        label: 'Edit Tag',
        icon: IconFlag,
        children: [],
      },
    ],
    sidebarOrder: 4,
  },
  {
    path: '/tags',
    element: TagPage,
    protected: true,
    label: 'Tag Management',
    icon: IconTags,
    sidebarOrder: 5,
    children: [
      {
        path: 'create',
        element: AddTagPage,
        protected: true,
        label: 'Create Tag',
        icon: IconFlag,
        children: [],
      },
      {
        path: 'edit/:id',
        element: EditTagPage,
        protected: true,
        label: 'Edit Tag',
        icon: IconFlag,
        children: [],
      },
    ],
  },
  {
    path: '/keywords',
    element: KeywordPage,
    protected: true,
    label: 'Keyword Management',
    icon: IconKey,
    children: [],
    sidebarOrder: 6,
  },
  {
    path: '/reports',
    element: ReportPage,
    protected: true,
    label: 'Report',
    icon: IconFlag,
    children: [],
    sidebarOrder: 7,
  },
  {
    path: '/account',
    element: AccountPage,
    protected: true,
    label: 'My Account',
    icon: IconFlag,
    children: [],
  },
  {
    path: '/users/:id',
    element: UserViewPage,
    protected: true,
    label: 'View User',
    icon: IconUsers,
    children: [],
  },
  {
    path: '/pins/:id',
    element: PinViewPage,
    protected: true,
    label: 'View Pin',
    icon: IconUsers,
    children: [],
  },
  {
    path: '/login',
    element: LoginPage,
    protected: false,
    label: 'Login',
    icon: IconLogin,
    children: [],
  },
];

export default routes;
