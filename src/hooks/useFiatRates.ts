import { useState, useEffect } from 'react';
import { CurrencyTypeEnum } from '@app/interfaces/interfaces';
import config from '@app/config/config';

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

const useFiatRates = (url: string) => {
  const [rates, setRates] = useState<FiatRate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const data = mockData.filter((rate) => url.includes(rate.currency));

        /* const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }
        const data = await response.json(); */
        setRates(data);
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    fetchRates();
  }, [url]);
  return { rates, error, isLoading }; // fill with rates/isLoading/error
};
//see CurrncyTypeEnum in interfaces.ts or currencies.ts
export const usEURRates = () => {
  return useFiatRates(`${config.baseURL}/api/rates/EUR`);
};
export const useGPBRates = () => {
  return useFiatRates(`${config.baseURL}/api/rates/GPB`);
};
export const useJPYRates = () => {
  return useFiatRates(`${config.baseURL}/api/rates/JPY`);
};
export const useAUDRates = () => {
  return useFiatRates(`${config.baseURL}/api/rates/AUD`);
};
export const useCADRates = () => {
  return useFiatRates(`${config.baseURL}/api/rates/CAD`);
};
export const useCHFRates = () => {
  return useFiatRates(`${config.baseURL}/api/rates/CHF`);
};
export const useCNYRates = () => {
  return useFiatRates(`${config.baseURL}/api/rates/CNY`);
};
export const useSEKRates = () => {
  return useFiatRates(`${config.baseURL}/api/rates/SEK`);
};
export const useNZDRates = () => {
  return useFiatRates(`${config.baseURL}/api/rates/NZD`);
};
