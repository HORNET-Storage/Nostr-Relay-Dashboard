import React, { useState } from 'react';
import * as S from './ReplaceTransaction.styles';
import { useResponsive } from '@app/hooks/useResponsive';
import TieredFees from '@app/components/nft-dashboard/Balance/components/SendForm/components/TieredFees/TieredFees';
interface ReplaceTransactionProps {
  onCancel: () => void;
  onReplace: () => void;
}

const ReplaceTransaction: React.FC<ReplaceTransactionProps> = ({ onCancel, onReplace }) => {
  const { isDesktop, isTablet } = useResponsive();
  const [inValidAmount, setInvalidAmount] = React.useState(false);

  const handleFeeChange = (fee: number) => {};

  return (
    <S.ContentWrapper>
      <S.FieldDisplay>
        <S.FieldLabel>Transaction ID</S.FieldLabel>
        <S.ValueWrapper isMobile={!isDesktop || !isTablet}>
          <S.FieldValue>123456</S.FieldValue>
        </S.ValueWrapper>
      </S.FieldDisplay>
      <S.FieldDisplay>
        <S.FieldLabel>Amount</S.FieldLabel>
        <S.ValueWrapper isMobile={!isDesktop || !isTablet}>
          <S.FieldValue>123456</S.FieldValue>
        </S.ValueWrapper>
      </S.FieldDisplay>
      {isDesktop || isTablet ? (
        <S.TiersRow>
          <TieredFees inValidAmount={inValidAmount} handleFeeChange={handleFeeChange} />
        </S.TiersRow>
      ) : (
        <S.TiersCol>
          <TieredFees inValidAmount={inValidAmount} handleFeeChange={handleFeeChange} />
        </S.TiersCol>
      )}
      <S.ButtonRow>
        <S.Button onClick={onCancel}>Cancel</S.Button>
        <S.Button onClick={onReplace}>Replace</S.Button>
      </S.ButtonRow>
    </S.ContentWrapper>
  );
};

export default ReplaceTransaction;
