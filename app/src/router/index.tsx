import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import routes, { RouteType } from "./config";
import { AuthGuard } from "@/components/auth/AuthGuard";
import Navigation from "@/components/Navigation";

const Router = () => {
  const renderRoutes = (routes: RouteType[]) => {
    return routes.map((route) => {
      // Public routes that don't require auth
      const publicRoutes = ['/login', '/auth/callback'];
      const isPublicRoute = publicRoutes.includes(route.path || '');
      
      if (route.index) {
        return (
          <Route 
            index 
            key={route.key} 
            element={
              <AuthGuard requireAuth={!isPublicRoute}>
                <route.component />
              </AuthGuard>
            } 
          />
        );
      }
      return (
        <Route 
          key={route.key} 
          path={route.path} 
          element={
            <AuthGuard requireAuth={!isPublicRoute}>
              <route.component />
            </AuthGuard>
          }
        >
          {route.children && renderRoutes(route.children)}
        </Route>
      );
    });
  };

  return (
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <div className="flex-grow">
            <Routes>
              {renderRoutes(routes)}
            </Routes>
          </div>
        </div>
      </Suspense>
  );
};

export default Router;