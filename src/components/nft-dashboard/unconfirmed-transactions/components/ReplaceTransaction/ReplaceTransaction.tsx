import React, { useEffect, useState } from 'react';
import * as S from './ReplaceTransaction.styles';
import { useResponsive } from '@app/hooks/useResponsive';
import TieredFees from '@app/components/nft-dashboard/Balance/components/SendForm/components/TieredFees/TieredFees';
import { PendingTransaction } from '@app/hooks/usePendingTransactions';
import { BaseSpin } from '@app/components/common/BaseSpin/BaseSpin';
import ResultScreen from '@app/components/nft-dashboard/Balance/components/SendForm/components/ResultScreen/ResultScreen';
import config from '@app/config/config';
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
  const [newFee, setNewFee] = useState(transaction.feeRate); // Fee rate in sat/vB
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
        const response = await fetch('http://localhost:9003/calculate-tx-size', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipient_address: transaction.recipient_address, // Use the original recipient address
            spend_amount: parseInt(transaction.amount.toString()), // The original amount
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
  }, [transaction.txid, transaction.amount, newFee]);

  // Calculate the total transaction cost (Amount + Calculated Fee)
  const totalCost = txSize && newFee ? Number(transaction.amount) + newFee * txSize : Number(transaction.amount);

  // Check if the total cost exceeds the user's balance
  const isBalanceInsufficient = balanceData?.latest_balance !== undefined && totalCost > balanceData.latest_balance;

  const handleFeeChange = (fee: number) => {
    setNewFee(fee);  // Update the new fee when it changes
  };

  const handleReplace = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);  // Start loading
  
    try {
      // Step 1: Initiate the replacement transaction
      const replaceRequest = {
        choice: 2,  // Replace transaction option
        original_tx_id: transaction.txid,  // Send the original transaction ID
        new_fee_rate: newFee,  // Send the updated fee rate
      };
  
      const response = await fetch('http://localhost:9003/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(replaceRequest),
      });
  
      const result = await response.json();
  
      // Handle different statuses from the wallet (success, pending, or failed)
      if (result.status === 'success' || result.status === 'pending') {
  
        // Step 2: If the replacement transaction succeeds or is pending, update the pending transactions
        const updatePendingRequest = {
          original_tx_id: transaction.txid,  // Original transaction ID to replace
          new_tx_id: result.txid,  // New transaction ID from the replacement
          new_fee_rate: Math.round(newFee),  // Updated fee rate
          amount: parseInt(transaction.amount, 10),  // Same amount
          recipient_address: transaction.recipient_address,  // Same recipient address
          enable_rbf: true,  // RBF status
        };
  
        const pendingResponse = await fetch(`${config.baseURL}/replacement-transactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatePendingRequest),
        });
  
        const pendingResult = await pendingResponse.json();
  
        // Step 3: Handle the final result from updating pending transactions
        if (pendingResponse.ok) {
          setResult({ isSuccess: true, message: pendingResult.message, txid: result.txid });
          setIsFinished(true);
          onReplace();  // Notify parent that the replacement and update were successful
        } else {
          setResult({ isSuccess: false, message: pendingResult.error || 'Failed to update pending transaction.', txid: '' });
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
      setLoading(false);  // Ensure loading stops in all cases
    }
  };
  


  if (isFinished) {
    return (
      <ResultScreen
        isSuccess={result.isSuccess}
        amount={parseFloat(transaction.amount.toString())}  // Convert string to number here
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
              type="number"  // Use 'number' input type to allow numerical values
              value={newFee}  // Bind the input value to the newFee state
              onChange={(e) => {
                const fee = parseFloat(e.target.value);
                if (!isNaN(fee)) {  // Ensure the value is a number
                  setNewFee(fee);  // Update the newFee state
                }
              }}
              min={0}  // You can add a minimum value of 0 for the fee to avoid negative values
              step={1}  // Optional: define the increment step for the fee input
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

// import React, { useEffect, useState } from 'react';
// import * as S from './ReplaceTransaction.styles';
// import { useResponsive } from '@app/hooks/useResponsive';
// import TieredFees from '@app/components/nft-dashboard/Balance/components/SendForm/components/TieredFees/TieredFees';
// import { PendingTransaction } from '@app/hooks/usePendingTransactions';
// import { BaseSpin } from '@app/components/common/BaseSpin/BaseSpin';
// import ResultScreen from '@app/components/nft-dashboard/Balance/components/SendForm/components/ResultScreen/ResultScreen';
// import config from '@app/config/config';
// import useBalanceData from '@app/hooks/useBalanceData';

// interface ReplaceTransactionProps {
//   onCancel: () => void;
//   onReplace: () => void;
//   transaction: PendingTransaction;
// }

// const ReplaceTransaction: React.FC<ReplaceTransactionProps> = ({ onCancel, onReplace, transaction }) => {
//   const { isDesktop, isTablet } = useResponsive();
//   const { balanceData, isLoading: isBalanceLoading } = useBalanceData();

//   const [inValidAmount, setInvalidAmount] = useState(false);
//   const [newFee, setNewFee] = useState(transaction.feeRate);
//   const [txSize, setTxSize] = useState<number | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [isFinished, setIsFinished] = useState(false);
//   const [result, setResult] = useState<{ isSuccess: boolean; message: string; txid: string }>({
//     isSuccess: false,
//     message: '',
//     txid: '',
//   });
//   const [isCustomFee, setIsCustomFee] = useState(false);
//   const [verificationInProgress, setVerificationInProgress] = useState(false);

//   // Fetch the transaction size when the fee changes or the component loads
//   useEffect(() => {
//     const fetchTransactionSize = async () => {
//       try {
//         const response = await fetch('https://localhost:443/calculate-tx-size', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             recipient_address: transaction.recipient_address,
//             spend_amount: parseInt(transaction.amount.toString()),
//             priority_rate: newFee,
//           }),
//         });

//         const result = await response.json();
//         setTxSize(result.txSize);
//       } catch (error) {
//         console.error('Error fetching transaction size:', error);
//         setTxSize(null);
//       }
//     };

//     fetchTransactionSize();
//   }, [transaction.txid, transaction.amount, newFee]);

//   // Calculate total cost
//   const totalCost = txSize && newFee ? Number(transaction.amount) + newFee * txSize : Number(transaction.amount);
//   const isBalanceInsufficient = balanceData?.latest_balance !== undefined && totalCost > balanceData.latest_balance;

//   // Handle fee changes
//   const handleFeeChange = (fee: number) => {
//     setNewFee(fee);
//     setIsCustomFee(false);
//   };

//   const handleCustomFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = parseFloat(e.target.value);
//     if (!isNaN(value) && value >= 0) {
//       setNewFee(value);
//       setIsCustomFee(true);
//     }
//   };

//   const fetchWithTimeout = async (url: string, options: RequestInit, timeout: number = 10000) => {
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), timeout);
  
//     try {
//       const response = await fetch(url, {
//         ...options,
//         signal: controller.signal,
//       });
//       clearTimeout(timeoutId);
//       return response;
//     } catch (error) {
//       if (error instanceof Error) {
//         console.error('RBF transaction failed:', error.message);
//         throw new Error(error.message);
//       }
//       throw error;
//     }
//   };

//   // Toggle between custom and preset fees
//   const toggleCustomFee = () => {
//     setIsCustomFee(!isCustomFee);
//   };

//   // Handle Replace transaction and verification
//   const handleReplace = async (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setLoading(true);

//     try {
//       const replaceRequest = {
//         choice: 2,
//         original_tx_id: transaction.txid,
//         new_fee_rate: newFee,
//       };

//       // Step 1: Broadcast the transaction
//       const response = await fetchWithTimeout('https://localhost:443/transaction', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(replaceRequest),
//       }, 30000);

//       const result = await response.json();

//       if (result.status === 'pending' || result.status === 'success') {
//         console.log('Transaction broadcasted. Updating pending transaction...');
        
//         const updatePendingRequest = {
//           original_tx_id: transaction.txid,
//           new_tx_id: result.txid,
//           new_fee_rate: newFee,
//           amount: transaction.amount,
//           recipient_address: transaction.recipient_address,
//         };

//         // Step 2: Update the pending transaction
//         const pendingResponse = await fetchWithTimeout(`${config.baseURL}/replacement-transactions`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(updatePendingRequest),
//         }, 100000);

//         const pendingResult = await pendingResponse.json();

//         if (pendingResult.status === 'success') {
//           setResult({ isSuccess: true, message: pendingResult.message, txid: pendingResult.txid });
//           setVerificationInProgress(false);
//         } else {
//           setResult({ isSuccess: false, message: pendingResult.message, txid: '' });
//         }

//         // Step 3: Verify the transaction in the mempool
//         if (result.status === 'pending') {
//           console.log('Transaction broadcasted but pending verification. Verifying in mempool...');
//           setVerificationInProgress(true);

//           const verifyTransaction = async () => {
//             const verifyRequest = { txID: result.txid };
//             const verifyResponse = await fetchWithTimeout('https://localhost:443/verify-transaction', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify(verifyRequest),
//             }, 30000);

//             const verifyResult = await verifyResponse.json();

//             if (verifyResult.status === 'success') {
//               console.log('Transaction verified in the mempool');
//               setResult({ isSuccess: true, message: verifyResult.message, txid: verifyResult.txid });
//             } else if (verifyResult.status === 'pending') {
//               console.log('Transaction not found in mempool yet. Retrying in 10 seconds.');
//               setTimeout(verifyTransaction, 10000); // Retry after 10 seconds
//             } else {
//               console.error('Verification failed:', verifyResult.message);
//               setResult({ isSuccess: false, message: verifyResult.message, txid: '' });
//             }
//           };

//           verifyTransaction(); // Start the verification process
//         }

//       } else {
//         setResult({ isSuccess: false, message: result.message, txid: '' });
//       }
//     } catch (error) {
//       console.error('RBF transaction failed:', error);
//       setResult({ isSuccess: false, message: 'RBF transaction failed due to a network error.', txid: '' });
//     } finally {
//       setIsFinished(true);
//       setLoading(false);
//     }
//   };

//   // If the process is finished, display the result
//   if (isFinished) {
//     return (
//       <ResultScreen
//         isSuccess={result.isSuccess}
//         amount={parseFloat(transaction.amount.toString())}
//         receiver={transaction.txid}
//         txid={result.txid}
//         message={result.message}
//       />
//     );
//   }

//   // Render the form UI
//   return (
//     <BaseSpin spinning={loading || isBalanceLoading || verificationInProgress}>
//       <S.ContentWrapper>
//         <S.FieldDisplay>
//           <S.FieldLabel>Transaction ID</S.FieldLabel>
//           <S.ValueWrapper isMobile={!isDesktop || !isTablet}>
//             <S.FieldValue>{transaction.txid}</S.FieldValue>
//           </S.ValueWrapper>
//         </S.FieldDisplay>
//         <S.FieldDisplay>
//           <S.FieldLabel>Amount</S.FieldLabel>
//           <S.ValueWrapper isMobile={!isDesktop || !isTablet}>
//             <S.FieldValue>{transaction.amount}</S.FieldValue>
//           </S.ValueWrapper>
//         </S.FieldDisplay>
        
//         {!isCustomFee && (
//           <TieredFees inValidAmount={inValidAmount} handleFeeChange={handleFeeChange} txSize={txSize} />
//         )}
        
//         <S.FieldDisplay>
//           <S.FieldLabel>New Fee</S.FieldLabel>
//           <S.ValueWrapper isMobile={!isDesktop || !isTablet}>
//             {isCustomFee ? (
//               <S.CustomFeeInput
//                 type="number"
//                 value={newFee}
//                 onChange={handleCustomFeeChange}
//                 min="0"
//                 step="0.1"
//               />
//             ) : (
//               <S.FieldValue>{newFee}</S.FieldValue>
//             )}
//           </S.ValueWrapper>
//         </S.FieldDisplay>
        
//         <S.ToggleCustomFee onClick={toggleCustomFee}>
//           {isCustomFee ? "Use preset fees" : "Enter custom fee"}
//         </S.ToggleCustomFee>

//         <S.FieldDisplay>
//           <S.FieldLabel>Total</S.FieldLabel>
//           <S.ValueWrapper isMobile={!isDesktop || !isTablet}>
//             <S.FieldValue>{totalCost}</S.FieldValue>
//           </S.ValueWrapper>
//         </S.FieldDisplay>

//         {isBalanceInsufficient && (
//           <S.ErrorMessage>Insufficient balance to complete the transaction.</S.ErrorMessage>
//         )}

//         <S.ButtonRow>
//           <S.Button onClick={onCancel}>Cancel</S.Button>
//           <S.Button onClick={handleReplace} disabled={isBalanceInsufficient || verificationInProgress}>
//             Replace
//           </S.Button>
//         </S.ButtonRow>
//       </S.ContentWrapper>
//     </BaseSpin>
//   );
// };

// export default ReplaceTransaction;
