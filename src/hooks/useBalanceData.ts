import { useState, useEffect } from 'react';
import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service'; // Assuming these services exist
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import { useHandleLogout } from '@app/utils/authUtils';

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

        // Fetch balance data
        const balanceResponse = await fetch(`${config.baseURL}/balance/usd`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Attach the JWT token to the request
          },
        });

        if (!balanceResponse.ok) {
          if (balanceResponse.status === 401) {
            handleLogout(); // Log out the user if token is invalid or expired
            throw new Error('Authentication failed. You have been logged out.');
          }
          throw new Error(`Network response was not ok (status: ${balanceResponse.status})`);
        }
        const balanceData: BalanceData = await balanceResponse.json();
        setBalanceData(balanceData);

        // Fetch transaction data
        const transactionsResponse = await fetch(`${config.baseURL}/transactions/latest`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Attach the JWT token to the request
          },
        });

        if (!transactionsResponse.ok) {
          if (transactionsResponse.status === 401) {
            handleLogout(); // Log out the user if token is invalid or expired
            throw new Error('Authentication failed. You have been logged out.');
          }
          throw new Error(`Network response was not ok (status: ${transactionsResponse.status})`);
        }
        const transactionsData: Transaction[] = await transactionsResponse.json();
        setTransactions(transactionsData);
        console.log('Transactions data:', transactionsData);

      } catch (error) {
        console.error('Error fetching data:', error);
        message.error(error instanceof Error ? error.message : 'An error occurred');
        setBalanceData(null);
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  return { balanceData, transactions, isLoading };
};

export default useBalanceData;
