import { useState, useEffect } from 'react';
import config from '@app/config/config';

interface Transaction {
  id: number;
  witness_tx_id: string;
  date: string;
  output: string;
  value: number;
}

interface BalanceData {
  balance_usd: number;
  latest_balance: number; // Add this field to include latest balance in SATs
}

const useBalanceData = () => {
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch balance data
        const balanceResponse = await fetch(`${config.baseURL}/balance/usd`);
        if (!balanceResponse.ok) {
          throw new Error(`Network response was not ok (status: ${balanceResponse.status})`);
        }
        const balanceData: BalanceData = await balanceResponse.json();
        setBalanceData(balanceData);

        // Fetch transaction data
        const transactionsResponse = await fetch(`${config.baseURL}/transactions/latest`);
        if (!transactionsResponse.ok) {
          throw new Error(`Network response was not ok (status: ${transactionsResponse.status})`);
        }
        const transactionsData: Transaction[] = await transactionsResponse.json();
        setTransactions(transactionsData);
        console.log('Transactions data:', transactionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { balanceData, transactions, isLoading };
};

export default useBalanceData;

// import { useState, useEffect } from 'react';

// interface Transaction {
//   id: number;
//   address: string;
//   date: string;
//   output: string;
//   value: number;
// }

// interface BalanceData {
//   balance_usd: number;
// }

// const useBalanceData = () => {
//   const [balanceData, setBalanceData] = useState<BalanceData | null>(null);
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         // Fetch balance data
//         const balanceResponse = await fetch('http://localhost:5000/balance/usd');
//         if (!balanceResponse.ok) {
//           throw new Error(`Network response was not ok (status: ${balanceResponse.status})`);
//         }
//         const balanceData = await balanceResponse.json();
//         setBalanceData(balanceData);

//         // Fetch transaction data
//         const transactionsResponse = await fetch('http://localhost:5000/transactions/latest');
//         if (!transactionsResponse.ok) {
//           throw new Error(`Network response was not ok (status: ${transactionsResponse.status})`);
//         }
//         const transactionsData = await transactionsResponse.json();
//         setTransactions(transactionsData);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   return { balanceData, transactions, isLoading };
// };

// export default useBalanceData;
