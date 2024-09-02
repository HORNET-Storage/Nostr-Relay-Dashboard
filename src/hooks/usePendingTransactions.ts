import { useState, useEffect } from 'react';
import config from '@app/config/config';

interface PendingTransaction {
  txid: string;
  feeRate: number;
  timestamp: string;
}

const usePendingTransactions = () => {
  const [pendingTransactions, setPendingTransactions] = useState<PendingTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPendingTransactions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${config.baseURL}/pending-transactions`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`Network response was not ok (status: ${response.status})`);
        }
        const data: PendingTransaction[] = await response.json();
        setPendingTransactions(data);
      } catch (error) {
        console.error('Error fetching pending transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingTransactions();
  }, []);

  return { pendingTransactions, isLoading };
};

export default usePendingTransactions;
