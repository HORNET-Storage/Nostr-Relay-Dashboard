import React from 'react';
import * as S from './UnconfirmedTransaction.styles'
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { useResponsive } from '@app/hooks/useResponsive';
import { truncateString } from '@app/utils/utils';

interface UnconfirmedTransactionProps {
  tx_id: string;
  date_created: string;
  amount: string;
  feeAmount?: string;
}

const UnconfirmedTransaction: React.FC<UnconfirmedTransactionProps> = ({ tx_id, date_created, amount, feeAmount }) => {

  const {isTablet} = useResponsive();
  return (
    
    <S.TransactionWrapper>
      <S.IDWrapper>
      <S.Value>{!isTablet ? truncateString(tx_id, 10) :  truncateString(tx_id, 30)}</S.Value>
        <S.Label>Transaction ID</S.Label>
       
      </S.IDWrapper>
      <S.DataWrapper>
      <S.Value>{date_created}</S.Value>
        <S.Label>Date Created</S.Label>
   
      </S.DataWrapper>
      <S.DataWrapper>
      <S.Value>{amount}</S.Value>
        <S.Label>Amount</S.Label>
       
      </S.DataWrapper>
    </S.TransactionWrapper>
  );
};

export default UnconfirmedTransaction;
