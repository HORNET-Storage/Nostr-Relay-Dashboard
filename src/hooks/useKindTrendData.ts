import { useState, useEffect } from 'react';
import config from '@app/config/config';

interface MonthlyKindData {
  month: string;
  totalSize: number;
}

const useKindTrendData = (kindNumber: number) => {
  const [trendData, setTrendData] = useState<MonthlyKindData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTrendData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${config.baseURL}/api/kind-trend/${kindNumber}`);
        if (!response.ok) {
          throw new Error('Failed to fetch kind trend data');
        }
        const data = await response.json();
        console.log('Trend data response:', data);
        setTrendData(data);
      } catch (error) {
        console.error('Error fetching kind trend data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendData();
  }, [kindNumber]);

  return { trendData, isLoading };
};

export default useKindTrendData;
