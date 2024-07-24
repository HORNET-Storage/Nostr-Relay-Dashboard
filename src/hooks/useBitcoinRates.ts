import { useState, useEffect } from 'react';
import config from '@app/config/config';
import { CurrencyTypeEnum } from '@app/interfaces/interfaces';
import { useAppDispatch } from './reduxHooks';
import { setCurrentPrice, setRates } from '@app/store/slices/currencySlice';
interface Earning {
  date: number;
  usd_value: number;
}

export const useBitcoinRates = (currency: CurrencyTypeEnum) => {
  const [rates, setRatesState] = useState<Earning[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchBitcoinRates = async (currency: CurrencyTypeEnum) => {
      try {
        const response = await fetch(`${config.baseURL}/bitcoin-rates/last-30-days/${currency.toLocaleLowerCase()}`);
        if (!response.ok) {
          throw new Error(`Network response was not ok (status: ${response.status})`);
        }
        const data = await response.json();
        const processedRates = data.map((item: { Rate: number; Timestamp: string }) => ({
          date: new Date(item.Timestamp).getTime(),
          usd_value: item.Rate,
        }))
        setRatesState(
          processedRates
        );
        dispatch(setRates(processedRates))
        dispatch(setCurrentPrice(processedRates[processedRates.length - 1].usd_value))
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
        console.error(err);
      }
    };

    fetchBitcoinRates(currency);
  }, [currency, dispatch]);

  return { rates, isLoading, error };
};
