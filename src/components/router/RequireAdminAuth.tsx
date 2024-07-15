// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { readToken, readUser } from '@app/services/localStorage.service';

// interface RequireAdminAuthProps {
//   children: React.ReactElement;
// }

// export const RequireAdminAuth: React.FC<RequireAdminAuthProps> = ({ children }) => {
//   const location = useLocation();
//   const token = readToken();
//   const user = readUser();

//   if (!token || !user || user.role !== 'admin') {
//     return <Navigate to="/auth/login" state={{ from: location }} replace />;
//   }

//   return children;
// };

import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { isUserExist } from '@app/services/authService';
import { WithChildrenProps } from '@app/types/generalTypes';

const RequireAdminAuth: React.FC<WithChildrenProps> = ({ children }) => {
  const token = useAppSelector((state) => state.auth.token);
  const [userExists, setUserExists] = useState<boolean | null>(null); // Initial state set to null
  const location = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      const exists = await isUserExist();
      console.log('User exists:', exists);
      setUserExists(exists);
    };

    checkUser();
  }, []);

  if (userExists === null) {
    return <div>Loading...</div>; // Or any loading spinner
  }

  console.log('Token:', token);
  console.log('User exists:', userExists);

  if (userExists && (token==='bearerToken' || !token || token === null)) {
    console.log('Redirecting to login because user exists but no token is found');
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  if (userExists && token!=='bearerToken') {
    console.log('User exists and token is valid, rendering children');
    return <>{children}</>;
  }

  if (!userExists) {
    console.log('No user exists, rendering children');
    return <>{children}</>;
  }

  return null; // This case should be unreachable but included for completeness
};

export default RequireAdminAuth;
