import React from 'react';
import { useTranslation } from 'react-i18next';
import { WalletTransaction } from '@app/api/activity.api';
import { Dates } from '@app/constants/Dates';
import { formatNumberWithCommas, getCurrencyPrice } from '@app/utils/utils';
import { CurrencyTypeEnum } from '@app/interfaces/interfaces';
import * as S from './ActivityStoryItem.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';

export const ActivityStoryItem: React.FC<WalletTransaction> = ({ address, date, output, value }) => {
  const { t } = useTranslation();

  // Convert value to number
  const numericValue = parseFloat(value);

  return (
    <S.TransactionCard>
      <BaseRow gutter={[20, 20]} wrap={true} align="middle">
        <BaseCol span={24}>
          <S.Label>{t('Address')}:</S.Label>
          <S.Address style={{ color: 'var(--text-main)' }}>{address}</S.Address>
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
