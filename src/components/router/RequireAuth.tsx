import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { isUserExist } from '@app/services/authService';
import { WithChildrenProps } from '@app/types/generalTypes';

const RequireAuth: React.FC<WithChildrenProps> = ({ children }) => {
  const token = useAppSelector((state) => state.auth.token);
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      const exists = await isUserExist();
      setUserExists(exists);
    };

    checkUser();
  }, []);

  useEffect(() => {
    console.log('Current token:', token);
    console.log('User exists:', userExists);
  }, [token, userExists]);

  if (userExists === null) {
    return <div>Loading...</div>; // Show a loading indicator while checking user existence
  }

  if (!userExists || !token) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default RequireAuth;