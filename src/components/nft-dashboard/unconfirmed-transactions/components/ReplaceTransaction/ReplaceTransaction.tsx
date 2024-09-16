import React, { useEffect, useState } from 'react';
import * as S from './ReplaceTransaction.styles';
import { useResponsive } from '@app/hooks/useResponsive';
import TieredFees from '@app/components/nft-dashboard/Balance/components/SendForm/components/TieredFees/TieredFees';
import { PendingTransaction } from '@app/hooks/usePendingTransactions';
import { BaseSpin } from '@app/components/common/BaseSpin/BaseSpin';
import ResultScreen from '@app/components/nft-dashboard/Balance/components/SendForm/components/ResultScreen/ResultScreen';
import config from '@app/config/config';
import useBalanceData from '@app/hooks/useBalanceData';
import useWalletAuth from '@app/hooks/useWalletAuth'; // Import authentication hook
import { notificationController } from '@app/controllers/notificationController'; // Handle notifications
import { deleteWalletToken, readToken } from '@app/services/localStorage.service'; // Delete wallet token if expired

interface ReplaceTransactionProps {
  onCancel: () => void;
  onReplace: () => void;
  transaction: PendingTransaction;
}

const ReplaceTransaction: React.FC<ReplaceTransactionProps> = ({ onCancel, onReplace, transaction }) => {
  const { isDesktop, isTablet } = useResponsive();
  const { balanceData, isLoading: isBalanceLoading } = useBalanceData(); // Fetch balance data using the hook
  const { isAuthenticated, login, token } = useWalletAuth(); // Use wallet authentication

  const [inValidAmount, setInvalidAmount] = useState(false);
  const [newFee, setNewFee] = useState(transaction.feeRate); // Fee rate in sat/vB
  const [txSize, setTxSize] = useState<number | null>(null); // State to store transaction size
  const [totalCost, setTotalCost] = useState<number>(parseInt(transaction.amount)); // State to store total cost
  const [loading, setLoading] = useState(false); // Add loading state
  const [isFinished, setIsFinished] = useState(false); // Add finished state
  const [result, setResult] = useState<{ isSuccess: boolean; message: string; txid: string }>({
    isSuccess: false,
    message: '',
    txid: '',
  });

  // Fetch the transaction size when the component mounts
  useEffect(() => {
    const fetchTransactionSize = async () => {
      try {
        if (!isAuthenticated) {
          await login(); // Ensure user is logged in
        }

        const response = await fetch('http://localhost:9003/calculate-tx-size', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include JWT token
          },
          body: JSON.stringify({
            recipient_address: transaction.recipient_address, // Use the original recipient address
            spend_amount: parseInt(transaction.amount.toString()), // The original amount
            priority_rate: newFee, // The current fee rate
          }),
        });

        if (response.status === 401) {
          const errorText = await response.text();
          if (errorText.includes('Token expired')) {
            notificationController.error({ message: 'Session expired. Please log in again.' });
            deleteWalletToken(); // Clear the old token
            await login(); // Re-initiate login
          }
          throw new Error(errorText);
        }

        const result = await response.json();
        setTxSize(result.txSize); // Set the transaction size
      } catch (error) {
        console.error('Error fetching transaction size:', error);
        setTxSize(null);
      }
    };

    fetchTransactionSize();
  }, [transaction.txid, transaction.amount, newFee, isAuthenticated, login, token]);

  // Calculate the total transaction cost (Amount + Calculated Fee)

  useEffect(() => {
    const totalCost = txSize && newFee ? Number(transaction.amount) + newFee * txSize : Number(transaction.amount);
    setTotalCost(totalCost);
  }, [txSize, newFee, transaction.amount]);
  // Check if the total cost exceeds the user's balance
  const isBalanceInsufficient = balanceData?.latest_balance !== undefined && totalCost > balanceData.latest_balance;

  const handleFeeChange = (fee: number) => {
    setNewFee(fee); // Update the new fee when it changes
  };

  const handleReplace = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true); // Start loading

    try {
      // Step 1: Ensure user is authenticated
      if (!isAuthenticated) {
        await login(); // Perform login if not authenticated
      }

      // Step 2: Initiate the replacement transaction
      const replaceRequest = {
        choice: 2, // Replace transaction option
        original_tx_id: transaction.txid, // Send the original transaction ID
        new_fee_rate: newFee, // Send the updated fee rate
      };

      const response = await fetch('http://localhost:9003/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include JWT token
        },
        body: JSON.stringify(replaceRequest),
      });

      if (response.status === 401) {
        const errorText = await response.text();
        if (errorText.includes('Token expired') || errorText.includes('Unauthorized: Invalid token')) {
          console.log('Session expired. Please log in again.');
          deleteWalletToken(); // Clear the old token
          await login(); // Re-initiate login
        }
        throw new Error(errorText);
      }

      const result = await response.json();

      const pendingToken = readToken();

      // Handle different statuses from the wallet (success, pending, or failed)
      if (result.status === 'success' || result.status === 'pending') {
        // Step 2: If the replacement transaction succeeds or is pending, update the pending transactions
        const updatePendingRequest = {
          original_tx_id: transaction.txid, // Original transaction ID to replace
          new_tx_id: result.txid, // New transaction ID from the replacement
          new_fee_rate: Math.round(newFee), // Updated fee rate
          amount: parseInt(transaction.amount, 10), // Same amount
          recipient_address: transaction.recipient_address, // Same recipient address
          enable_rbf: true, // RBF status
        };

        const pendingResponse = await fetch(`${config.baseURL}/api/replacement-transactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${pendingToken}`, // Include the JWT token in the Authorization header
          },
          body: JSON.stringify(updatePendingRequest),
        });

        const pendingResult = await pendingResponse.json();

        // Step 3: Handle the final result from updating pending transactions
        if (pendingResponse.ok) {
          setResult({ isSuccess: true, message: pendingResult.message, txid: result.txid });
          setIsFinished(true);
          onReplace(); // Notify parent that the replacement and update were successful
        } else {
          setResult({
            isSuccess: false,
            message: pendingResult.error || 'Failed to update pending transaction.',
            txid: '',
          });
          setIsFinished(true);
        }
      } else {
        // Handle error in the replacement transaction
        setResult({ isSuccess: false, message: result.message || 'Replacement transaction failed.', txid: '' });
        setIsFinished(true);
      }
    } catch (error) {
      console.error('RBF transaction failed:', error);
      setResult({ isSuccess: false, message: 'RBF transaction failed due to a network error.', txid: '' });
      setIsFinished(true);
    } finally {
      setLoading(false); // Ensure loading stops in all cases
    }
  };

  if (isFinished) {
    return (
      <ResultScreen
        isSuccess={result.isSuccess}
        amount={parseFloat(transaction.amount.toString())} // Convert string to number here
        receiver={transaction.txid}
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
            <S.FieldValue>{transaction.txid}</S.FieldValue>
          </S.ValueWrapper>
        </S.FieldDisplay>
        <S.FieldDisplay>
          <S.FieldLabel>Amount</S.FieldLabel>
          <S.ValueWrapper isMobile={!isDesktop || !isTablet}>
            <S.FieldValue>{transaction.amount}</S.FieldValue>
          </S.ValueWrapper>
        </S.FieldDisplay>
        {/* Pass the transaction size to TieredFees to dynamically calculate the fee */}
        <TieredFees inValidAmount={inValidAmount} handleFeeChange={handleFeeChange} txSize={txSize} />
        <S.FieldDisplay>
          <S.FieldLabel>New Fee</S.FieldLabel>
          <S.ValueWrapper isMobile={!isDesktop || !isTablet}>
            <input
              type="number" // Use 'number' input type to allow numerical values
              value={newFee} // Bind the input value to the newFee state
              onChange={(e) => {
                const fee = parseFloat(e.target.value);
                if (!isNaN(fee)) {
                  setNewFee(fee); // Update the newFee state
                }
              }}
              min={0} // Minimum value of 0 for the fee
              step={1} // Optional: define the increment step for the fee input
            />
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
        {isBalanceInsufficient && <S.ErrorMessage>Insufficient balance to complete the transaction.</S.ErrorMessage>}

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
