import { CurrencyTypeEnum } from '@app/interfaces/interfaces';

export const currencies = {
  [CurrencyTypeEnum.USD]: {
    text: 'USD',
    icon: '$',
  },
  [CurrencyTypeEnum.BTC]: {
    text: 'BTC',
    icon: '₿',
  },
  [CurrencyTypeEnum.ETH]: {
    text: 'ETH',
    icon: 'Ξ',
  },
  [CurrencyTypeEnum.EUR]: {
    text: 'EUR',
    icon: '€',
  },

  [CurrencyTypeEnum.GBP]: {
    text: 'GBP',
    icon: '£',
  },
  [CurrencyTypeEnum.JPY]: {
    text: 'JPY',
    icon: '¥',
  },
  [CurrencyTypeEnum.AUD]: {
    text: 'AUD',
    icon: 'A$',
  },
  [CurrencyTypeEnum.CAD]: {
    text: 'CAD',
    icon: 'C$',
  },
  [CurrencyTypeEnum.CHF]: {
    text: 'CHF',
    icon: 'Fr.',
  },
  [CurrencyTypeEnum.CNY]: {
    text: 'CNY',
    icon: '¥',
  },
  [CurrencyTypeEnum.SEK]: {
    text: 'SEK',
    icon: 'kr',
  },
  [CurrencyTypeEnum.NZD]: {
    text: 'NZD',
    icon: 'NZ$',
  },
  [CurrencyTypeEnum.SATS]: {
    text: 'SATS',
    icon: 'SAT ',
  },
};
