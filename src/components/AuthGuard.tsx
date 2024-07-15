import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { readToken } from '@app/services/localStorage.service';
import config from '@app/config/config';  // Import the config

interface AuthGuardProps {
  children: React.ReactElement;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const location = useLocation();
  const token = readToken();

  console.log('Current token from AuthGuard:', token);
  console.log('Demo mode:', config.isDemoMode);

  if (config.isDemoMode) {
    console.log('Demo mode is active, allowing access');
    return children;
  }

  if (!token || token === 'bearerToken' || token === null) {
    console.log('No valid token, redirecting to login');
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
};
