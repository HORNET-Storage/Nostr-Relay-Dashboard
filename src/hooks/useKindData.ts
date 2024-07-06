import { useState, useEffect } from 'react';
import kindMapping from '../constants/kindMapping';
import config from '@app/config/config';

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

  useEffect(() => {
    const fetchKindData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${config.baseURL}/api/kinds`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchKindData();
  }, []);

  return { kindData, isLoading };
};

export default useKindData;

// import { useState, useEffect } from 'react';
// import config from '@app/config/config';

// interface KindData {
//   kindName: string;
//   kindCount: number;
//   totalSize: number;
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
//         setKindData(data);
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
