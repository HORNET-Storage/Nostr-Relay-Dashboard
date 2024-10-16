
import { useState, useEffect } from 'react';
import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service'; // Assuming these services exist
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import { useHandleLogout } from './authUtils';

interface BarChartDataItem {
  month: string;
  notes_gb: number;
  media_gb: number;
}

const useBarChartData = () => {
  const [data, setData] = useState<BarChartDataItem[] | null>(null);
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

        const response = await fetch(`${config.baseURL}/api/barchartdata`, {
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
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  return { data, isLoading };
};

export default useBarChartData;


// import { useState, useEffect } from 'react';
// import config from '@app/config/config';

// interface BarChartDataItem {
//   month: string;
//   notes_gb: number;
//   media_gb: number;
// }

// const useBarChartData = () => {
//   const [data, setData] = useState<BarChartDataItem[] | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const response = await fetch(`${config.baseURL}/api/barchartdata`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({}), // If needed, include a payload here
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

// export default useBarChartData;
