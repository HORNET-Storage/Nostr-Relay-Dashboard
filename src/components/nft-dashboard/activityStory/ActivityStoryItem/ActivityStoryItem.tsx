import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WalletTransaction } from '@app/api/activity.api';
import { Dates } from '@app/constants/Dates';
import { getCurrencyPrice } from '@app/utils/utils';
import { CurrencyTypeEnum } from '@app/interfaces/interfaces';
import * as S from './ActivityStoryItem.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { useBitcoinRates } from '@app/hooks/useBitcoinRates'

function makeHexId(length: number): string {
  const characters = 'abcdef0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export const ActivityStoryItem: React.FC<WalletTransaction> = ({
  witness_tx_id,
  date,
  output,
  value,
}) => {
  const { t } = useTranslation();
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const { rates, isLoading, error } = useBitcoinRates();

  // Effect to initialize the transaction ID when the component mounts
  useEffect(() => {
    if (!witness_tx_id) {
      setTransactionId(makeHexId(64));
    }
  }, [witness_tx_id]);

  // Parse 'value' as BTC amount
  const btcAmount = parseFloat(value);

  const [usdValue, setUsdValue] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && rates.length > 0 && btcAmount) {
      // Convert the transaction date to a timestamp
      const transactionDate = new Date(date).getTime();

      // Find the rate closest to the transaction date
      let closestRate = rates[0];
      let minDiff = Math.abs(rates[0].date - transactionDate);

      for (let i = 1; i < rates.length; i++) {
        const diff = Math.abs(rates[i].date - transactionDate);
        if (diff < minDiff) {
          minDiff = diff;
          closestRate = rates[i];
        }
      }

      const rate = closestRate.usd_value;

      // Compute the USD value
      const usdAmount = btcAmount * rate;
      setUsdValue(usdAmount);
    }
  }, [isLoading, rates, btcAmount, date]);

  // Handle potential errors and loading states
  if (error) {
    return <div>Error loading exchange rates: {error}</div>;
  }

  if (isLoading || usdValue === null) {
    return <div>Loading...</div>;
  }

  return (
    <S.TransactionCard>
      <BaseRow gutter={[20, 20]} wrap={true} align="middle">
        <BaseCol span={24}>
          <S.Label>{'Transaction ID'}:</S.Label>
          <S.Address style={{ color: 'var(--text-main)' }}>
            {witness_tx_id ? witness_tx_id : transactionId}
          </S.Address>
        </BaseCol>
        <BaseCol span={24}>
          <S.Label>{'Address'}:</S.Label>
          <S.Output>{output}</S.Output>
        </BaseCol>
        <BaseCol span={12}>
          <S.Label>{'Date'}:</S.Label>
          <S.DateText>{Dates.getDate(date).format('L LTS')}</S.DateText>
        </BaseCol>
        <BaseCol span={12} style={{ textAlign: 'right' }}>
          <S.Label>{'Value'}:</S.Label>
          <S.Value>
            {getCurrencyPrice(
              usdValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
              CurrencyTypeEnum.USD
            )}
          </S.Value>
        </BaseCol>
      </BaseRow>
    </S.TransactionCard>
  );
};

export default ActivityStoryItem;





// import React, {useEffect, useState} from 'react';
// import { useTranslation } from 'react-i18next';
// import { WalletTransaction } from '@app/api/activity.api';
// import { Dates } from '@app/constants/Dates';
// import { formatNumberWithCommas, getCurrencyPrice } from '@app/utils/utils';
// import { CurrencyTypeEnum } from '@app/interfaces/interfaces';
// import * as S from './ActivityStoryItem.styles';
// import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
// import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
// import { useBitcoinRates } from '@app/hooks/useBitcoinRates'

// function makeHexId(length: number): string {
//   const characters = 'abcdef0123456789';
//   let result = '';
//   for (let i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * characters.length));
//   }
//   return result;
// }

// // Use the useBitcoinRates hook
// const { rates, isLoading, error } = useBitcoinRates();

// export const ActivityStoryItem: React.FC<WalletTransaction> = ({ witness_tx_id, date, output, value }) => {
//   const { t } = useTranslation();
//   const [transactionId, setTransactionId] = useState<string | null>(null);

//   // Effect to initialize the transaction ID when the component mounts
//   useEffect(() => {
//     if (!witness_tx_id) {
//       setTransactionId(makeHexId(64));
//     }
//   }, [witness_tx_id]);

//   const numericValue = parseFloat(value);



//   return (
//     <S.TransactionCard>
//       <BaseRow gutter={[20, 20]} wrap={true} align="middle">
//         <BaseCol span={24}>
//           <S.Label>{t('Witness Transaction ID')}:</S.Label>
//           <S.Address style={{ color: 'var(--text-main)' }}>  {witness_tx_id ? witness_tx_id : transactionId}</S.Address>
//         </BaseCol>
//         <BaseCol span={24}>
//           <S.Label>{t('Output')}:</S.Label>
//           <S.Output>{output}</S.Output>
//         </BaseCol>
//         <BaseCol span={12}>
//           <S.Label>{t('Date')}:</S.Label>
//           <S.DateText>{Dates.getDate(date).format('L LTS')}</S.DateText>
//         </BaseCol>
//         <BaseCol span={12} style={{ textAlign: 'right' }}>
//           <S.Label>{t('Value')}:</S.Label>
//           <S.Value>{getCurrencyPrice(formatNumberWithCommas(numericValue), CurrencyTypeEnum.USD)}</S.Value>
//         </BaseCol>
//       </BaseRow>
//     </S.TransactionCard>
//   );
// };

// export default ActivityStoryItem;
