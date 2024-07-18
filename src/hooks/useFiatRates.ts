import { useState, useEffect } from 'react';
import { CurrencyTypeEnum } from '@app/interfaces/interfaces';

interface FiatRate {
  currency: CurrencyTypeEnum;
  rate: number;
  date: number;
}
const mockData: FiatRate[] = [
  { currency: CurrencyTypeEnum.EUR, rate: 1.2, date: 1622505600000 },
  { currency: CurrencyTypeEnum.EUR, rate: 1.22, date: 1622592000000 },
  { currency: CurrencyTypeEnum.GBP, rate: 1.38, date: 1622505600000 },
  { currency: CurrencyTypeEnum.GBP, rate: 1.39, date: 1622592000000 },
  { currency: CurrencyTypeEnum.JPY, rate: 110.5, date: 1622505600000 },
  { currency: CurrencyTypeEnum.JPY, rate: 110.75, date: 1622592000000 },
  { currency: CurrencyTypeEnum.AUD, rate: 0.75, date: 1622505600000 },
  { currency: CurrencyTypeEnum.AUD, rate: 0.76, date: 1622592000000 },
  { currency: CurrencyTypeEnum.CAD, rate: 1.25, date: 1622505600000 },
  { currency: CurrencyTypeEnum.CAD, rate: 1.26, date: 1622592000000 },
  { currency: CurrencyTypeEnum.CHF, rate: 0.92, date: 1622505600000 },
  { currency: CurrencyTypeEnum.CHF, rate: 0.93, date: 1622592000000 },
  { currency: CurrencyTypeEnum.CNY, rate: 6.45, date: 1622505600000 },
  { currency: CurrencyTypeEnum.CNY, rate: 6.46, date: 1622592000000 },
  { currency: CurrencyTypeEnum.SEK, rate: 8.5, date: 1622505600000 },
  { currency: CurrencyTypeEnum.SEK, rate: 8.52, date: 1622592000000 },
  { currency: CurrencyTypeEnum.NZD, rate: 0.7, date: 1622505600000 },
  { currency: CurrencyTypeEnum.NZD, rate: 0.71, date: 1622592000000 },
];

const useFiatRates = (currency: CurrencyTypeEnum) => {
  const [rates, setRates] = useState<FiatRate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRates = () => {
      setIsLoading(true);
      setTimeout(() => {
        setRates(mockData.filter((item) => item.currency === currency));
        setIsLoading(false);
      }, 1000);
    };
    fetchRates();
  }, [currency]);

  return { rates, isLoading, error };
};

export default useFiatRates;
