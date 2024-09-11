import { useState, useEffect } from 'react';
import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service'; // Assuming you have these services for token management
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import { useHandleLogout } from './authUtils';

interface ActivityDataItem {
  month: string;
  total_gb: number;
}

const useActivityData = () => {
  const [data, setData] = useState<ActivityDataItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useDispatch();

  const handleLogout = useHandleLogout();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = readToken(); // Read JWT from localStorage
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${config.baseURL}/api/activitydata`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Attach the JWT token to the request
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            handleLogout(); // Log out the user if token is invalid or expired
            throw new Error('Authentication failed. You have been logged out.');
          }
          throw new Error(`Network response was not ok (status: ${response.status})`);
        }

        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error:', error);
        message.error(error instanceof Error ? error.message : 'An error occurred');
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  return { data, isLoading };
};

export default useActivityData;


// import { useState, useEffect } from 'react';
// import config from '@app/config/config';

// interface ActivityDataItem {
//   month: string;
//   total_gb: number;
// }

// const useActivityData = () => {
//   const [data, setData] = useState<ActivityDataItem[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const response = await fetch(`${config.baseURL}/api/activitydata`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
//         if (!response.ok) {
//           throw new Error(`Network response was not ok (status: ${response.status})`);
//         }
//         const data = await response.json();
//         setData(data);
//       } catch (error) {
//         console.error('Error:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   return { data, isLoading };
// };

// export default useActivityData;
