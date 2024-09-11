import { useAppDispatch } from '@app/hooks/reduxHooks'; // Make sure your hook path is correct
import { doLogout } from '@app/store/slices/authSlice'; // Adjust the path as necessary
import { message } from 'antd';

export const useHandleLogout = () => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(doLogout())
      .unwrap()
      .then(() => {
        message.info('You have been logged out. Please login again.');
      })
      .catch((error) => {
        console.error('Logout error:', error);
        message.error('An error occurred during logout.');
      });
  };

  return handleLogout;
};