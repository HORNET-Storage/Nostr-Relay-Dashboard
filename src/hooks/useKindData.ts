import { useState, useEffect } from 'react';
import kindMapping from '../constants/kindMapping';
import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service'; // Assuming these services exist
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import { useHandleLogout } from '@app/utils/authUtils';

interface KindData {
  kindNumber: number;
  totalSize: number;
  kindCount: number;
  kindName: string;
  description: string;
  nip: string;
}

const useKindData = () => {
  const [kindData, setKindData] = useState<KindData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useDispatch();

  const handleLogout = useHandleLogout();

  useEffect(() => {
    const fetchKindData = async () => {
      setIsLoading(true);
      try {
        const token = readToken(); // Read JWT from local storage
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${config.baseURL}/api/kinds`, {
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
          throw new Error(`Network response was not ok (status: ${response.status})`);
        }

        const data = await response.json();
        const enrichedData = data.map((item: any) => {
          const mapping = kindMapping[item.kindNumber] || { description: 'Unknown', nip: 'Unknown' };
          return {
            ...item,
            kindName: `Kind ${item.kindNumber}`,
            description: mapping.description,
            nip: mapping.nip,
          };
        });
        setKindData(enrichedData);
      } catch (error) {
        console.error('Error fetching kind data:', error);
        message.error(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchKindData();
  }, [dispatch]);

  return { kindData, isLoading };
};

export default useKindData;


// import { useState, useEffect } from 'react';
// import kindMapping from '../constants/kindMapping';
// import config from '@app/config/config';

// interface KindData {
//   kindNumber: number;
//   totalSize: number;
//   kindCount: number;
//   kindName: string;
//   description: string;
//   nip: string;
// }

// const useKindData = () => {
//   const [kindData, setKindData] = useState<KindData[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchKindData = async () => {
//       setIsLoading(true);
//       try {
//         const response = await fetch(`${config.baseURL}/api/kinds`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
//         if (!response.ok) {
//           throw new Error(`Network response was not ok (status: ${response.status})`);
//         }
//         const data = await response.json();
//         const enrichedData = data.map((item: any) => {
//           const mapping = kindMapping[item.kindNumber] || { description: 'Unknown', nip: 'Unknown' };
//           return {
//             ...item,
//             kindName: `Kind ${item.kindNumber}`,
//             description: mapping.description,
//             nip: mapping.nip,
//           };
//         });
//         setKindData(enrichedData);
//       } catch (error) {
//         console.error('Error fetching kind data:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchKindData();
//   }, []);

//   return { kindData, isLoading };
// };

// export default useKindData;
