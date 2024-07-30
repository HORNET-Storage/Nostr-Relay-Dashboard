import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { WalletTransaction } from '@app/api/activity.api';
import { Dates } from '@app/constants/Dates';
import { formatNumberWithCommas, getCurrencyPrice } from '@app/utils/utils';
import { CurrencyTypeEnum } from '@app/interfaces/interfaces';
import * as S from './ActivityStoryItem.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
function makeHexId(length: number): string {
  const characters = 'abcdef0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export const ActivityStoryItem: React.FC<WalletTransaction> = ({ witness_tx_id, date, output, value }) => {
  const { t } = useTranslation();
  const [transactionId, setTransactionId] = useState<string | null>(null);

  // Effect to initialize the transaction ID when the component mounts
  useEffect(() => {
    if (!witness_tx_id) {
      setTransactionId(makeHexId(64));
    }
  }, [witness_tx_id]);

  const numericValue = parseFloat(value);



  return (
    <S.TransactionCard>
      <BaseRow gutter={[20, 20]} wrap={true} align="middle">
        <BaseCol span={24}>
          <S.Label>{t('Witness Transaction ID')}:</S.Label>
          <S.Address style={{ color: 'var(--text-main)' }}>  {witness_tx_id ? witness_tx_id : transactionId}</S.Address>
        </BaseCol>
        <BaseCol span={24}>
          <S.Label>{t('Output')}:</S.Label>
          <S.Output>{output}</S.Output>
        </BaseCol>
        <BaseCol span={12}>
          <S.Label>{t('Date')}:</S.Label>
          <S.DateText>{Dates.getDate(date).format('L LTS')}</S.DateText>
        </BaseCol>
        <BaseCol span={12} style={{ textAlign: 'right' }}>
          <S.Label>{t('Value')}:</S.Label>
          <S.Value>{getCurrencyPrice(formatNumberWithCommas(numericValue), CurrencyTypeEnum.USD)}</S.Value>
        </BaseCol>
      </BaseRow>
    </S.TransactionCard>
  );
};

export default ActivityStoryItem;
