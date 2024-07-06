import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { isUserExist } from '@app/services/authService';
import { WithChildrenProps } from '@app/types/generalTypes';

const RequireAdminAuth: React.FC<WithChildrenProps> = ({ children }) => {
  const token = useAppSelector((state) => state.auth.token);
  const [userExists, setUserExists] = useState<boolean | null>(null); // changed initial state to null
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

  // Ensure the token value is what you expect
  if (userExists && token === 'bearerToken') {
    console.log('Redirecting to login because user exists but no token is found');
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  } else if (userExists && (token !== 'bearerToken' || token !== null || token !== undefined || token !== '')) {
    return <>{children}</>;
  }

  if (!userExists) {
    console.log('No user exists, rendering children');
    return <>{children}</>;
  }

  return null;
};

export default RequireAdminAuth;

// import React, { useEffect, useState } from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAppSelector } from '@app/hooks/reduxHooks';
// import { isUserExist } from '@app/services/authService';
// import { WithChildrenProps } from '@app/types/generalTypes';

// const RequireAdminAuth: React.FC<WithChildrenProps> = ({ children }) => {
//   const token = useAppSelector((state) => state.auth.token);
//   const [userExists, setUserExists] = useState<boolean | null>(null); // changed initial state to null
//   const location = useLocation();

//   useEffect(() => {
//     const checkUser = async () => {
//       const exists = await isUserExist();
//       console.log('User exists:', exists);
//       setUserExists(exists);
//     };

//     checkUser();
//   }, []);

//   if (userExists === null) {
//     return <div>Loading...</div>; // Or any loading spinner
//   }

//   if (userExists && !token) {
//     console.log('Redirecting to login because user exists but no token is found');
//     return <Navigate to="/auth/login" replace state={{ from: location }} />;
//   }

//   if (!userExists) {
//     console.log('No user exists, rendering children');
//     return <>{children}</>;
//   }

//   return null;
// };

// export default RequireAdminAuth;

// // src/components/router/RequireAdminAuth.tsx
// import React, { useEffect, useState } from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAppSelector } from '@app/hooks/reduxHooks';
// import { isUserExist } from '@app/services/authService';
// import { WithChildrenProps } from '@app/types/generalTypes';

// const RequireAdminAuth: React.FC<WithChildrenProps> = ({ children }) => {
//   const token = useAppSelector((state) => state.auth.token);
//   const [userExists, setUserExists] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(true);
//   const location = useLocation();

//   useEffect(() => {
//     const checkUser = async () => {
//       const exists = await isUserExist();
//       setUserExists(exists);
//       setLoading(false);
//     };

//     checkUser();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>; // Or any loading spinner
//   }

//   if (!userExists) {
//     return <>{children}</>;
//   }

//   return token ? (
//     <>{children}</>
//   ) : (
//     <Navigate to="/auth/login" replace state={{ from: location }} />
//   );
// };

// export default RequireAdminAuth;
