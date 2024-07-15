// Logout.tsx
import React, { useEffect } from 'react';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { Navigate } from 'react-router-dom';
import { doLogout } from '@app/store/slices/authSlice';

const Logout: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const logoutAndReload = async () => {
      await dispatch(doLogout());
      window.location.reload(); // Reload the page to clear any persisted state
    };

    logoutAndReload();
  }, [dispatch]);

  return <Navigate to="/auth/login" replace />;
};

export default Logout;
