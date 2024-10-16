import { useState, useEffect } from 'react';
import config from '@app/config/config';
import { readToken } from '@app/services/localStorage.service';

export interface PendingTransaction {
    txid: string;
    feeRate: number;
    timestamp: string; // ISO format string
    amount: string;
    recipient_address: string; // Add recipient address
    enable_rbf: boolean
  }  

const usePendingTransactions = () => {
  const [pendingTransactions, setPendingTransactions] = useState<PendingTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPendingTransactions = async () => {
      setIsLoading(true);
      // Fetch the JWT token using readToken()
      const pendingToken = readToken();
      try {
        const response = await fetch(`${config.baseURL}/api/pending-transactions`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${pendingToken}`, // Use the token from readToken()
          },
        });
        if (!response.ok) {
          throw new Error(`Network response was not ok (status: ${response.status})`);
        }
        const data: PendingTransaction[] | null = await response.json();
        console.log('Fetched Pending Transactions:', data); 
        setPendingTransactions(data || []); // Ensuring it is always an array
      } catch (error) {
        console.error('Error fetching pending transactions:', error);
        setPendingTransactions([]); // Setting an empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingTransactions();
  }, []);

  return { pendingTransactions, isLoading };
};

export default usePendingTransactions;


