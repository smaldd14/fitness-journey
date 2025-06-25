import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { user, loading } = useAuthStore();
  const location = useLocation();

  // Show loading spinner while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <h2 className="text-lg font-semibold">Loading...</h2>
        </div>
      </div>
    );
  }

  // If auth is required but user is not logged in, redirect to login
  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is logged in but trying to access login page, redirect to home
  if (!requireAuth && user && location.pathname === '/login') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};