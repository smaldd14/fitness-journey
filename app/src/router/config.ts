import HomePage from '@/pages/Home';
import { LoginPage } from '@/pages/auth/Login';
import { AuthCallbackPage } from '@/pages/auth/Callback';
import { ComponentType } from 'react';

export type RouteType = {
  path?: string;
  key: string;
  component: ComponentType<object>; 
  children?: RouteType[];
  index?: boolean;
  props?: Record<string, object>;
};

export type RoutesConfig = RouteType[];

const routes: RoutesConfig = [
  {
    path: "/",
    key: "Root",
    component: HomePage,
    index: true,
  },
  {
    path: "/login",
    key: "Login",
    component: LoginPage,
  },
  {
    path: "/auth/callback",
    key: "AuthCallback",
    component: AuthCallbackPage,
  },
];

export default routes;