import React from 'react';
import * as S from './UnconfirmedTransaction.styles'

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
        <S.Label>Transaction ID</S.Label>
        <S.Value>{tx_id}</S.Value>
      </S.DataWrapper>
      <S.DataWrapper>
        <S.Label>Date Created</S.Label>
        <S.Value>{date_created}</S.Value>
      </S.DataWrapper>
      <S.DataWrapper>
        <S.Label>Amount</S.Label>
        <S.Value>{amount}</S.Value>
      </S.DataWrapper>
    </S.TransactionWrapper>
  );
};

export default UnconfirmedTransaction;
