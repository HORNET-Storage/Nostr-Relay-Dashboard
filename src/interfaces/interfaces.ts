import { NumericLiteral } from 'typescript';

export type Dimension = number | string;

export type ChartData = number[];

export type xData = number[] | string[];

export type LanguageType = 'de' | 'en';

export type ThemeType = 'light' | 'dark';

export interface ChartSeries {
  seriesName: string;
  value: number;
  data: {
    day: number;
    value: NumericLiteral;
  };
  name: string;
}

export type ChartSeriesData = ChartSeries[];

export type Severity = 'success' | 'error' | 'info' | 'warning';

export type TwoFactorAuthOption = 'email';

export type ActivityStatusType = 'sold' | 'booked' | 'added';

export enum CurrencyTypeEnum {
  USD = 'USD',
  EUR = 'EUR', // Euro
  GBP = 'GBP', // British Pound
  JPY = 'JPY', // Japanese Yen
  AUD = 'AUD', // Australian Dollar
  CAD = 'CAD', // Canadian Dollar
  CHF = 'CHF', // Swiss Franc
  CNY = 'CNY', // Chinese Yuan
  SEK = 'SEK', // Swedish Krona
  NZD = 'NZD', // New Zealand Dollar
  ETH = 'ETH',
  BTC = 'BTC',
  SATS = 'SATS'
}

export interface PaymentCard {
  cvc: string;
  expiry: string;
  name: string;
  number: string;
  // eslint-disable-next-line
  focused: any;
  background: string;
  isEdit: boolean;
}

export interface Earning {
  date: number;
  usd_value: number;
}
