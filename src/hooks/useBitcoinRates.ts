import { useState, useEffect } from 'react';
import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service'; // Assuming these services exist
import { useDispatch } from 'react-redux';
import { useHandleLogout } from '@app/utils/authUtils';

interface Earning {
  date: number;
  usd_value: number;
}

export const useBitcoinRates = () => {
  const [rates, setRates] = useState<Earning[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const handleLogout = useHandleLogout();

  useEffect(() => {
    const fetchBitcoinRates = async () => {
      setIsLoading(true);
      setError(null); // Reset error state before fetching

      try {
        const token = readToken(); // Read JWT from localStorage
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${config.baseURL}/bitcoin-rates/last-30-days`, {
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
        setRates(
          data.map((item: { Rate: number; Timestamp: string }) => ({
            date: new Date(item.Timestamp).getTime(),
            usd_value: item.Rate,
          })),
        );
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBitcoinRates();
  }, [dispatch]);

  return { rates, isLoading, error };
};


// import { useState, useEffect } from 'react';
// import config from '@app/config/config';

// interface Earning {
//   date: number;
//   usd_value: number;
// }

// export const useBitcoinRates = () => {
//   const [rates, setRates] = useState<Earning[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchBitcoinRates = async () => {
//       try {
//         const response = await fetch(`${config.baseURL}/bitcoin-rates/last-30-days`);
//         if (!response.ok) {
//           throw new Error(`Network response was not ok (status: ${response.status})`);
//         }
//         const data = await response.json();
//         setRates(
//           data.map((item: { Rate: number; Timestamp: string }) => ({
//             date: new Date(item.Timestamp).getTime(),
//             usd_value: item.Rate,
//           })),
//         );
//         setIsLoading(false);
//       } catch (err: any) {
//         setError(err.message);
//         setIsLoading(false);
//       }
//     };

//     fetchBitcoinRates();
//   }, []);

//   return { rates, isLoading, error };
// };
