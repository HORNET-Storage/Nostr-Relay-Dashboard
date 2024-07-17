import { useState, useEffect } from 'react';
import { CurrencyTypeEnum } from '@app/interfaces/interfaces';
import config from '@app/config/config';
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

const useFiatRates = (url: string) => {
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }
        const data = await response.json();
        // set rates
        //set loading to false
      } catch (error) {
        //set error
        //set loading to false
      }
    };
    fetchRates();
  }, [url]);
  return {}; // fill with rates/isLoading/error
};
