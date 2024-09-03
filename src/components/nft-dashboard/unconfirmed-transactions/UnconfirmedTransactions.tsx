import React, { useState } from 'react';
import * as S from './UnconfirmedTransactions.styles';
import UnconfirmedTransaction from './components/UnconfirmedTransaction/UnconfirmedTransaction';
import ReplaceTransaction from './components/ReplaceTransaction/ReplaceTransaction';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import usePendingTransactions, { PendingTransaction } from '@app/hooks/usePendingTransactions';

const UnconfirmedTransactions: React.FC = () => {
  const [isReplacingTransaction, setIsReplacingTransaction] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<PendingTransaction | null>(null);
  const { pendingTransactions } = usePendingTransactions();

  const handleOpenReplaceTransaction = (transaction: PendingTransaction) => {
    setSelectedTransaction(transaction);
    setIsReplacingTransaction(true);
  };

  const handleCancelReplaceTransaction = () => {
    setSelectedTransaction(null);
    setIsReplacingTransaction(false);
  };

  const onReplaceTransaction = () => {
    // Define any behavior after replacing a transaction
  };

  return (
    <S.ContentWrapper>
      {isReplacingTransaction && selectedTransaction ? (
        <>
          <S.PanelHeaderText>Replace Transaction</S.PanelHeaderText>
          <ReplaceTransaction
            transaction={selectedTransaction}
            onReplace={onReplaceTransaction}
            onCancel={handleCancelReplaceTransaction}
          />
        </>
      ) : (
        <>
          <S.PanelHeaderText>Unconfirmed Transactions</S.PanelHeaderText>
          <S.PanelContent>
            {pendingTransactions.length === 0 ? (
              <S.NoTransactionsText>No unconfirmed transactions available.</S.NoTransactionsText>
            ) : (
              pendingTransactions.map((transaction) => (
                <S.RowWrapper key={transaction.TxID}>
                  <S.TransactionWrapper>
                    <UnconfirmedTransaction
                      tx_id={transaction.TxID}
                      date_created={new Date(transaction.Timestamp).toLocaleDateString()}
                      amount={transaction.Amount !== undefined && transaction.Amount !== null ? transaction.Amount.toString() : 'N/A'}
                    />
                  </S.TransactionWrapper>
                  <S.ButtonWrapper>
                    <BaseButton onClick={() => handleOpenReplaceTransaction(transaction)}>Replace</BaseButton>
                  </S.ButtonWrapper>
                </S.RowWrapper>
              ))
            )}
          </S.PanelContent>
        </>
      )}
    </S.ContentWrapper>
  );
};

export default UnconfirmedTransactions;




