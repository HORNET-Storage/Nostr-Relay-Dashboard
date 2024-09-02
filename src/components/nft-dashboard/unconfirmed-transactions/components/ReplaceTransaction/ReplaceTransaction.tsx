import React from 'react';
import * as S from './ReplaceTransaction.styles';
import { useResponsive } from '@app/hooks/useResponsive';
interface ReplaceTransactionProps {
  onCancel: () => void;
  onReplace: () => void;
}

const ReplaceTransaction: React.FC<ReplaceTransactionProps> = ({onCancel, onReplace}) => {
  const { isDesktop } = useResponsive();
  return (
    <S.ContentWrapper>
      <S.FieldDisplay>
        <S.FieldLabel>Transaction ID</S.FieldLabel>
        <S.ValueWrapper isMobile={!isDesktop}>
          {' '}
          <S.FieldValue>123456</S.FieldValue>
        </S.ValueWrapper>
      </S.FieldDisplay>
      <S.FieldDisplay>
        <S.FieldLabel>Amount</S.FieldLabel>
        <S.FieldValue>123456</S.FieldValue>
      </S.FieldDisplay>
      <S.ButtonRow>
        <S.Button onClick = {onCancel}>Cancel</S.Button>
        <S.Button onClick = {onReplace}>Replace</S.Button>
      </S.ButtonRow>
    </S.ContentWrapper>
  );
};

export default ReplaceTransaction;
