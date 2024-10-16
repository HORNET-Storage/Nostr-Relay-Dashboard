import { useState, useEffect } from 'react';
import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service'; // Assuming these services exist
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import { useHandleLogout } from './authUtils';

interface MonthlyKindData {
  month: string;
  totalSize: number;
}

const useKindTrendData = (kindNumber: number | null) => {
  const [trendData, setTrendData] = useState<MonthlyKindData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useDispatch();

  const handleLogout = useHandleLogout();

  useEffect(() => {
    if (kindNumber === null) {
      // Don't fetch data if kindNumber is null
      return;
    }

    const fetchTrendData = async () => {
      setIsLoading(true);
      try {
        const token = readToken(); // Read JWT from localStorage
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${config.baseURL}/api/kind-trend/${kindNumber}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Attach the JWT token to the request
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            handleLogout(); // Log out if token is invalid or expired
            throw new Error('Authentication failed. You have been logged out.');
          }
          throw new Error('Failed to fetch kind trend data');
        }

        const data = await response.json();
        setTrendData(data);
      } catch (error) {
        console.error('Error fetching kind trend data:', error);
        message.error(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendData();
  }, [kindNumber, dispatch]);

  return { trendData, isLoading };
};

export default useKindTrendData;



// import { useState, useEffect } from 'react';
// import config from '@app/config/config';

// interface MonthlyKindData {
//   month: string;
//   totalSize: number;
// }

// const useKindTrendData = (kindNumber: number) => {
//   const [trendData, setTrendData] = useState<MonthlyKindData[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchTrendData = async () => {
//       setIsLoading(true);
//       try {
//         const response = await fetch(`${config.baseURL}/api/kind-trend/${kindNumber}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch kind trend data');
//         }
//         const data = await response.json();
//         console.log('Trend data response:', data);
//         setTrendData(data);
//       } catch (error) {
//         console.error('Error fetching kind trend data:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchTrendData();
//   }, [kindNumber]);

//   return { trendData, isLoading };
// };

// export default useKindTrendData;
