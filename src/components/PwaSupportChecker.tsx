// components/PwaSupportChecker.tsx
import React, { useEffect } from 'react';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { setPWASupported } from '@app/store/slices/pwaSlice';

const PwaSupportChecker: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkPWASupport = () => {
      const isSupported = 'serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window;
      console.log('PWA support check:', isSupported);
      dispatch(setPWASupported(isSupported));
    };

    checkPWASupport();
  }, [dispatch]);

  return null; // This component doesn't render anything
};

export default PwaSupportChecker;
