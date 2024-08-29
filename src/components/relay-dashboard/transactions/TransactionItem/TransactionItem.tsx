import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WalletTransaction } from '@app/api/activity.api';
import { Dates } from '@app/constants/Dates';
import * as S from './TransactionItem.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { useBitcoinRates } from '@app/hooks/useBitcoinRates';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { CurrencyTypeEnum } from '@app/interfaces/interfaces';
import { convertSatsToCurrency, getCurrencyPrice, formatNumberWithCommas } from '@app/utils/utils';
function makeHexId(length: number): string {
  const characters = 'abcdef0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function convertBtcToUsd(btcValue: string, btcPriceInUsd: number): string {
  const btcAmount = parseFloat(btcValue);
  if (btcAmount < 1) {
    const satoshis = Math.round(btcAmount * 100000000);
    const usdValue = (satoshis / 100000000) * btcPriceInUsd;
    return usdValue.toFixed(2);
  } else {
    const wholeBtc = Math.floor(btcAmount);
    const satoshis = Math.round((btcAmount - wholeBtc) * 100000000);
    const usdValue = wholeBtc * btcPriceInUsd + (satoshis / 100000000) * btcPriceInUsd;
    return usdValue.toFixed(2);
  }
}

export const TransactionItem: React.FC<WalletTransaction> = ({ witness_tx_id, date, output, value }) => {
  const { t } = useTranslation();
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [transactionValue, setTransactionValue] = useState<string>('');
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyTypeEnum>(CurrencyTypeEnum.USD);
  const currency = useAppSelector((state) => state.currency);

  useEffect(() => {
    if (!witness_tx_id) {
      setTransactionId(makeHexId(64));
    }
  }, [witness_tx_id]);

  useEffect(() => {
    if (!currency.currentPrice) {
      setCurrentCurrency(currency.currency);
      setTransactionValue(value);
    } else {
      if (currency.currency !== currentCurrency) {
        setCurrentCurrency(currency.currency);
      }
      if (currency.currency === CurrencyTypeEnum.SATS) {
        setTransactionValue(parseFloat(value).toString());
      } else {
        setTransactionValue(convertSatsToCurrency(parseFloat(value), currency.currentPrice).toString());
      }
    }
  }, [currency.currentPrice, currency.currency, value]);

  // useEffect(() => {
  //   if (!isLoading && !error && rates.length > 0) {
  //     const btcPrice = rates[rates.length - 1].usd_value; // Get the most recent BTC price
  //     const usdValueCalculated = convertBtcToUsd(value, btcPrice);
  //     setTransactionValue(usdValueCalculated);
  //   }
  // }, [value, rates, isLoading, error]);

  // Skip rendering if the value is zero
  if (parseFloat(value) === 0) {
    return null;
  }

  return (
    <S.TransactionCard>
      <BaseRow gutter={[20, 20]} wrap={true} align="middle">
        <BaseCol span={24}>
          <S.Label>{t('Transaction ID')}:</S.Label>
          <S.Address style={{ color: 'var(--text-main)' }}> {witness_tx_id ? witness_tx_id : transactionId}</S.Address>
        </BaseCol>
        <BaseCol span={24}>
          <S.Label>{t('Address')}:</S.Label>
          <S.Output>{output}</S.Output>
        </BaseCol>
        <BaseCol span={12}>
          <S.Label>{t('Date')}:</S.Label>
          <S.DateText>{Dates.getDate(date).format('L LTS')}</S.DateText>
        </BaseCol>
        <BaseCol span={12} style={{ textAlign: 'right' }}>
          <S.Label>{t('Value')}:</S.Label>
          <S.Value>
            {currency.currency === CurrencyTypeEnum.SATS
              ? ` ${transactionValue} Sats`
              : getCurrencyPrice(formatNumberWithCommas(parseFloat(transactionValue)), currentCurrency)}
          </S.Value>
        </BaseCol>
      </BaseRow>
    </S.TransactionCard>
  );
};

export default TransactionItem;
