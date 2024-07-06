import React, { useEffect } from 'react';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { Navigate } from 'react-router-dom';
import { doLogout } from '@app/store/slices/authSlice';

const Logout: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const logoutAndReload = async () => {
      await dispatch(doLogout());
      window.location.reload(); // This will reload the page
    };

    logoutAndReload();
  }, [dispatch]);

  return <Navigate to="/auth/login" replace />;
};

export default Logout;

// import React, { useEffect } from 'react';
// import { useAppDispatch } from '@app/hooks/reduxHooks';
// import { Navigate } from 'react-router-dom';
// import { doLogout } from '@app/store/slices/authSlice';

// const Logout: React.FC = () => {
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     dispatch(doLogout());
//   }, [dispatch]);

//   return <Navigate to="/auth/login" replace />;
// };

// export default Logout;
