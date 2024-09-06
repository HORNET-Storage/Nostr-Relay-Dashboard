import React, { useEffect, useState } from 'react';
import * as S from './ReplaceTransaction.styles';
import { useResponsive } from '@app/hooks/useResponsive';
import TieredFees from '@app/components/nft-dashboard/Balance/components/SendForm/components/TieredFees/TieredFees';
import { PendingTransaction } from '@app/hooks/usePendingTransactions';
import { BaseSpin } from '@app/components/common/BaseSpin/BaseSpin';
import ResultScreen from '@app/components/nft-dashboard/Balance/components/SendForm/components/ResultScreen/ResultScreen';
import useBalanceData from '@app/hooks/useBalanceData';

interface ReplaceTransactionProps {
  onCancel: () => void;
  onReplace: () => void;
  transaction: PendingTransaction;
}

const ReplaceTransaction: React.FC<ReplaceTransactionProps> = ({ onCancel, onReplace, transaction }) => {
  const { isDesktop, isTablet } = useResponsive();
  const { balanceData, isLoading: isBalanceLoading } = useBalanceData(); // Fetch balance data using the hook

  const [inValidAmount, setInvalidAmount] = useState(false);
  const [newFee, setNewFee] = useState(transaction.FeeRate); // Fee rate in sat/vB
  const [txSize, setTxSize] = useState<number | null>(null);  // State to store transaction size
  const [loading, setLoading] = useState(false);  // Add loading state
  const [isFinished, setIsFinished] = useState(false);  // Add finished state
  const [result, setResult] = useState<{ isSuccess: boolean; message: string; txid: string }>({
    isSuccess: false,
    message: '',
    txid: '',
  });

  // Fetch the transaction size when the component mounts
  useEffect(() => {
    const fetchTransactionSize = async () => {
      try {
        const response = await fetch('https://localhost:443/calculate-tx-size', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipient_address: transaction.RecipientAddress, // Use the original recipient address
            spend_amount: parseInt(transaction.Amount.toString()), // The original amount
            priority_rate: newFee, // The current fee rate
          }),
        });

        const result = await response.json();
        setTxSize(result.txSize);  // Set the transaction size
      } catch (error) {
        console.error('Error fetching transaction size:', error);
        setTxSize(null);
      }
    };

    fetchTransactionSize();
  }, [transaction.TxID, transaction.Amount, newFee]);

  // Calculate the total transaction cost (Amount + Calculated Fee)
  const totalCost = txSize && newFee ? Number(transaction.Amount) + newFee * txSize : Number(transaction.Amount);

  // Check if the total cost exceeds the user's balance
  const isBalanceInsufficient = balanceData?.latest_balance !== undefined && totalCost > balanceData.latest_balance;

  const handleFeeChange = (fee: number) => {
    setNewFee(fee);  // Update the new fee when it changes
  };

  const handleReplace = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);  // Start loading

    try {
      const replaceRequest = {
        choice: 2,  // Replace transaction option
        original_tx_id: transaction.TxID,  // Send the original transaction ID
        new_fee_rate: newFee,  // Send the updated fee rate
      };

      const response = await fetch('http://localhost:9003/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(replaceRequest),
      });

      const result = await response.json();
      setLoading(false);  // Stop loading

      if (result.status === 'success') {
        setResult({ isSuccess: true, message: result.message, txid: result.txid });
        setIsFinished(true);
        onReplace();  // Notify the parent that the replace was successful
      } else {
        setResult({ isSuccess: false, message: result.message, txid: '' });
        setIsFinished(true);
      }
    } catch (error) {
      console.error('RBF transaction failed:', error);
      setLoading(false);  // Stop loading
      setResult({ isSuccess: false, message: 'RBF transaction failed due to a network error.', txid: '' });
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <ResultScreen
        isSuccess={result.isSuccess}
        amount={parseFloat(transaction.Amount.toString())}  // Convert string to number here
        receiver={transaction.TxID}
        txid={result.txid}
        message={result.message}
      />
    );
  }

  return (
    <BaseSpin spinning={loading || isBalanceLoading}>
      <S.ContentWrapper>
        <S.FieldDisplay>
          <S.FieldLabel>Transaction ID</S.FieldLabel>
          <S.ValueWrapper isMobile={!isDesktop || !isTablet}>
            <S.FieldValue>{transaction.TxID}</S.FieldValue>
          </S.ValueWrapper>
        </S.FieldDisplay>
        <S.FieldDisplay>
          <S.FieldLabel>Amount</S.FieldLabel>
          <S.ValueWrapper isMobile={!isDesktop || !isTablet}>
            <S.FieldValue>{transaction.Amount}</S.FieldValue>
          </S.ValueWrapper>
        </S.FieldDisplay>
        {/* Pass the transaction size to TieredFees to dynamically calculate the fee */}
        <TieredFees inValidAmount={inValidAmount} handleFeeChange={handleFeeChange} txSize={txSize} />
        <S.FieldDisplay>
          <S.FieldLabel>New Fee</S.FieldLabel>
          <S.ValueWrapper isMobile={!isDesktop || !isTablet}>
            <S.FieldValue>{newFee}</S.FieldValue>
          </S.ValueWrapper>
        </S.FieldDisplay>
        <S.FieldDisplay>
          <S.FieldLabel>Total</S.FieldLabel>
          <S.ValueWrapper isMobile={!isDesktop || !isTablet}>
            {/* Calculate total amount (Amount + Fee based on transaction size) */}
            <S.FieldValue>{totalCost}</S.FieldValue>
          </S.ValueWrapper>
        </S.FieldDisplay>

        {/* Show error message if balance is insufficient */}
        {isBalanceInsufficient && (
          <S.ErrorMessage>Insufficient balance to complete the transaction.</S.ErrorMessage>
        )}

        <S.ButtonRow>
          <S.Button onClick={onCancel}>Cancel</S.Button>
          {/* Disable replace button if total cost exceeds balance */}
          <S.Button onClick={handleReplace} disabled={isBalanceInsufficient}>
            Replace
          </S.Button>
        </S.ButtonRow>
      </S.ContentWrapper>
    </BaseSpin>
  );
};

export default ReplaceTransaction;
