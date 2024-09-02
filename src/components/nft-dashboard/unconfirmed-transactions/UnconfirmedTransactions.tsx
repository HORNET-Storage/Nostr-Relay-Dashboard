import React, { useState } from 'react';
import * as S from './UnconfirmedTransactions.styles';
import UnconfirmedTransaction from './components/UnconfirmedTransaction/UnconfirmedTransaction';
import ReplaceTransaction from './components/ReplaceTransaction/ReplaceTransaction';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
interface UnconfirmedTransactionsProps {
  transactions: any[]; //TODO: update the type
}

const UnconfirmedTransactions: React.FC<UnconfirmedTransactionsProps> = ({}) => {
  const [isReplacingTransaction, setIsReplacingTransaction] = useState(false);

  const handleOpenReplaceTransaction = () => {
    setIsReplacingTransaction(true);
  };
  const handleCancelReplaceTransaction = () => {
    setIsReplacingTransaction(false);
  };

  const onReplaceTransaction = () => {};
  return (
    <S.ContentWrapper>
      {isReplacingTransaction ? (
        <>
          <S.PanelHeaderText>Replace Transaction</S.PanelHeaderText>
          <ReplaceTransaction onReplace={onReplaceTransaction} onCancel={handleCancelReplaceTransaction} />
        </>
      ) : (
        <>
          <S.PanelHeaderText>Unconfirmed Transactions</S.PanelHeaderText>
          <S.PanelContent>
            <S.RowWrapper>
              <S.TransactionWrapper>
                <UnconfirmedTransaction tx_id="123456" date_created="2021-09-01" amount="0.0001" />
              </S.TransactionWrapper>
              <S.ButtonWrapper>
                <BaseButton onClick={handleOpenReplaceTransaction}>Replace</BaseButton>
              </S.ButtonWrapper>
            </S.RowWrapper>
          </S.PanelContent>
        </>
      )}
    </S.ContentWrapper>
  );
};

export default UnconfirmedTransactions;
