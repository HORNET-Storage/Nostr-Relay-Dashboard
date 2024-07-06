// Update the api/earnings.api.ts file
import { CurrencyTypeEnum } from '@app/interfaces/interfaces';

export interface Balance {
  USD: number;
  ETH: number;
  BTC: number;
}

export interface Earning {
  date: number;
  usd_value: number;
}

export interface TotalEarning {
  total: number;
  prevTotal: number;
  currency: CurrencyTypeEnum;
  timeline: Earning[];
}

export const getBalance = (id: number): Promise<Balance> => {
  return new Promise((res) => {
    setTimeout(() => {
      res({
        USD: 3040.51,
        ETH: 1040.51,
        BTC: 5373.51,
      });
    }, 0);
  });
};

export const getTotalEarning = (id: number, currency: CurrencyTypeEnum): Promise<TotalEarning> => {
  return new Promise((res) => {
    setTimeout(() => {
      res({
        total: 1520,
        prevTotal: 1320,
        currency: CurrencyTypeEnum.USD,
        timeline: [
          {
            date: Date.now() - 1000 * 60 * 60 * 24 * 7,
            usd_value: 100,
          },
          {
            date: Date.now() - 1000 * 60 * 60 * 24 * 6,
            usd_value: 200,
          },
          {
            date: Date.now() - 1000 * 60 * 60 * 24 * 5,
            usd_value: 180,
          },
          {
            date: Date.now() - 1000 * 60 * 60 * 24 * 4,
            usd_value: 350,
          },
          {
            date: Date.now() - 1000 * 60 * 60 * 24 * 3,
            usd_value: 280,
          },
          {
            date: Date.now() - 1000 * 60 * 60 * 24 * 2,
            usd_value: 300,
          },
          {
            date: Date.now() - 1000 * 60 * 60 * 24,
            usd_value: 320,
          },
        ],
      });
    }, 0);
  });
};

export const getBitcoinRatesForLast30Days = (): Promise<Earning[]> => {
  console.log('Fetching bitcoin rate data.');
  return fetch('http://localhost:5000/bitcoin-rates/last-30-days')
    .then((response) => response.json())
    .then((data) => {
      console.log('Received data:', data); // Add log statement to see the data
      return data.map((item: { Rate: number; Timestamp: string }) => ({
        date: new Date(item.Timestamp).getTime(),
        usd_value: item.Rate,
      }));
    });
};
