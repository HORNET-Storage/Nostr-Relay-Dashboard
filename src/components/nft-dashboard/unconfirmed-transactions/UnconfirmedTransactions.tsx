import React, { useState } from 'react';
import * as S from './UnconfirmedTransactions.styles';
import UnconfirmedTransaction from './components/UnconfirmedTransaction/UnconfirmedTransaction';
import ReplaceTransaction from './components/ReplaceTransaction/ReplaceTransaction';
import usePendingTransactions, { PendingTransaction } from '@app/hooks/usePendingTransactions';
import { useResponsive } from '@app/hooks/useResponsive';
// const dummyTransactions: PendingTransaction[] = [
//   //for testing purposes
//   {
//     TxID: '1123u1293u123u139u12321312312',
//     Timestamp: '2022-01-01T00:00:00Z',
//     Amount: 10,
//     FeeRate: 4,
//   },
//   {
//     TxID: '2',
//     Timestamp: '2022-01-02T00:00:00Z',
//     Amount: 20,
//     FeeRate: 3,
//   },
//   {
//     TxID: '3',
//     Timestamp: '2022-01-03T00:00:00Z',
//     Amount: 30,
//     FeeRate: 2,
//   },
//   {
//     TxID: '4',
//     Timestamp: '2022-01-03T00:00:00Z',
//     Amount: 30,
//     FeeRate: 2,
//   },
//   {
//     TxID: '5',
//     Timestamp: '2022-01-03T00:00:00Z',
//     Amount: 30,
//     FeeRate: 2,
//   },
// ];

const UnconfirmedTransactions: React.FC = () => {
  const [isReplacingTransaction, setIsReplacingTransaction] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<PendingTransaction | null>(null);
  const { pendingTransactions } = usePendingTransactions();
  const { isTablet, isDesktop } = useResponsive();

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
              <S.ScrollPanel>
                {pendingTransactions.map((transaction) => (
                  <S.RowWrapper $isMobile={!isDesktop || !isTablet} key={transaction.txid}>
                    <S.TransactionWrapper>
                      <UnconfirmedTransaction
                        tx_id={transaction.txid}
                        date_created={new Date(transaction.timestamp).toLocaleDateString()}
                        amount={
                          transaction.amount !== undefined && transaction.amount !== null
                            ? transaction.amount.toString()
                            : 'N/A'
                        }
                      />
                    </S.TransactionWrapper>
                    <S.ButtonWrapper $isMobile={!isDesktop || !isTablet}>
                      {/* Disable the Replace button if enable_rbf is false */}
                      <S.ReplaceButton
                        $isMobile={!isDesktop || !isTablet}
                        disabled={!transaction.enable_rbf} // Disable if enable_rbf is false
                        onClick={() => handleOpenReplaceTransaction(transaction)}
                      >
                        Replace
                      </S.ReplaceButton>
                    </S.ButtonWrapper>
                  </S.RowWrapper>
                ))}
              </S.ScrollPanel>
            )}
          </S.PanelContent>
        </>
      )}
    </S.ContentWrapper>
  );
};

export default UnconfirmedTransactions;
