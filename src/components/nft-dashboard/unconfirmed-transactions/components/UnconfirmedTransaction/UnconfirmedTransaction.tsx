import React from 'react';
import * as S from './UnconfirmedTransaction.styles'
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';

interface UnconfirmedTransactionProps {
  tx_id: string;
  date_created: string;
  amount: string;
  feeAmount?: string;
}

const UnconfirmedTransaction: React.FC<UnconfirmedTransactionProps> = ({ tx_id, date_created, amount, feeAmount }) => {
  // Implement your component logic here

  return (
    
    <S.TransactionWrapper>
      <S.DataWrapper>
      <S.Value>{tx_id}</S.Value>
        <S.Label>Transaction ID</S.Label>
       
      </S.DataWrapper>
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
