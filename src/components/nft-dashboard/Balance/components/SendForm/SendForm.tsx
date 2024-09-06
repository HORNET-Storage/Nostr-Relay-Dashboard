import React, { useEffect, useState } from 'react';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { useResponsive } from '@app/hooks/useResponsive';
import { BaseSpin } from '@app/components/common/BaseSpin/BaseSpin';
import * as S from './SendForm.styles';
import { truncateString } from '@app/utils/utils';
import useBalanceData from '@app/hooks/useBalanceData';
import { BaseCheckbox } from '@app/components/common/BaseCheckbox/BaseCheckbox';
import config from '@app/config/config';
import TieredFees from './components/TieredFees/TieredFees';

interface SendFormProps {
  onSend: (status: boolean, address: string, amount: number, txid?: string, message?: string) => void;
}

interface PendingTransaction {
  txid: string;
  feeRate: number;
  timestamp: string; // ISO format string
  amount: string;
  recipient_address: string;
}

export type tiers = 'low' | 'med' | 'high';

const SendForm: React.FC<SendFormProps> = ({ onSend }) => {
  const { balanceData, isLoading } = useBalanceData();

  const [loading, setLoading] = useState(false);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [inValidAmount, setInvalidAmount] = useState(false);
  const [addressError, setAddressError] = useState(false);

  const [amountWithFee, setAmountWithFee] = useState<number | null>(null);
  const [totalCost, setTotalCost] = useState<number | null>(null); // To store the total cost (amount + fee)

  const [fee, setFee] = useState<number>(0);
  const [formData, setFormData] = useState({
    address: '',
    amount: '1',
  });

  const [txSize, setTxSize] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // For error messaging

  // Debounced effect to calculate transaction size when the amount changes
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (formData.amount.length > 0) {
        // Call backend to calculate transaction size
        const fetchTransactionSize = async () => {
          try {
            const response = await fetch('http://localhost:9003/calculate-tx-size', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                recipient_address: formData.address,
                spend_amount: parseInt(formData.amount),
                priority_rate: fee,  // Pass the fee rate
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
      }
    }, 500); // Debounce for 500ms

    return () => clearTimeout(debounceTimeout); // Clear the timeout if the amount changes before 500ms
  }, [formData.amount, fee]);

  // Calculate the fee based on the transaction size
  useEffect(() => {
    if (txSize && fee) {
      const estimatedFee = txSize * fee;
      const total = parseInt(formData.amount) + estimatedFee;
      setAmountWithFee(total);
      setTotalCost(total);
    }
  }, [txSize, fee, formData.amount]);

  // Check if the total cost exceeds the user's balance
  useEffect(() => {
    if (totalCost !== null && balanceData?.latest_balance !== undefined && totalCost > balanceData.latest_balance) {
      setErrorMessage('Insufficient balance to complete the transaction.');
    } else {
      setErrorMessage(null); // Reset error if the total cost is within balance
    }    
  }, [totalCost, balanceData]);

  const handleFeeChange = (fee: number) => {
    setFee(fee);
  };

  const isValidAddress = (address: string) => {
    return address.length > 0;
  };

  const handleAddressSubmit = () => {
    const isValid = isValidAddress(formData.address);

    if (isValid) {
      setAddressError(false);
      setIsDetailsOpen(true);
    } else {
      setAddressError(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSend = async () => {
    if (loading || inValidAmount) return;

    setLoading(true);

    const selectedFee = fee; // Default to low if not selected

    const transactionRequest = {
      choice: 1, // Default to choice 1 for new transactions
      recipient_address: formData.address,
      spend_amount: parseInt(formData.amount),
      priority_rate: selectedFee,
    };

    try {
      const response = await fetch('http://localhost:9003/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionRequest),
      });

      const result = await response.json();
      setLoading(false);

      if (result.status === 'success') {
        // Prepare the transaction details to send to the pending-transactions endpoint
        const pendingTransaction: PendingTransaction = {
          txid: result.txid,
          feeRate: selectedFee,
          timestamp: new Date().toISOString(), // Capture the current time in ISO format
          amount: formData.amount,
          recipient_address: formData.address, // Send the recipient address
        };

        // Send the transaction details to the pending-transactions endpoint
        await fetch(`${config.baseURL}/pending-transactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pendingTransaction),
        });

        // Call the onSend callback with the result
        onSend(true, formData.address, transactionRequest.spend_amount, result.txid, result.message);
      } else {
        onSend(false, formData.address, 0, '', result.message);
      }
    } catch (error) {
      console.error('Transaction failed:', error);
      setLoading(false);
      onSend(false, formData.address, 0, '', 'Transaction failed due to a network error.');
    }
  };

  useEffect(() => {
    if (formData.amount.length <= 0 || (balanceData && parseInt(formData.amount) > balanceData.latest_balance)) {
      setInvalidAmount(true);
    } else {
      setInvalidAmount(false);
    }
  }, [formData.amount, balanceData]);

  const receiverPanel = () => (
    <>
      <S.InputWrapper>
        <S.InputHeader>Address</S.InputHeader>
        <BaseInput name="address" value={formData.address} onChange={handleInputChange} placeholder="Send to" />
      </S.InputWrapper>
      <BaseButton onClick={handleAddressSubmit}>Continue</BaseButton>
    </>
  );

  const detailsPanel = () => (
    <S.FormSpacer>
      <S.InputWrapper>
        <S.TextRow>
          <S.InputHeader>{`Amount = ${amountWithFee ? amountWithFee : ''}`}</S.InputHeader>

          {inValidAmount && <S.ErrorText>Invalid Amount</S.ErrorText>}
        </S.TextRow>

        <div>
          <BaseInput onChange={handleInputChange} name="amount" value={formData.amount} placeholder="Amount" />
          <S.BalanceInfo>{`Balance: ${balanceData ? balanceData.latest_balance : 0}`}</S.BalanceInfo>
        </div>
      </S.InputWrapper>
      <S.TiersContainer>
        <S.InputHeader>Tiered Fees</S.InputHeader>
        <S.RBFWrapper>
          <BaseCheckbox />
          RBF Opt In
        </S.RBFWrapper>
        <TieredFees inValidAmount={inValidAmount} handleFeeChange={handleFeeChange} txSize={txSize} />
      </S.TiersContainer>
      {/* Display an error if the total exceeds the balance */}
      {errorMessage && <S.ErrorText>{errorMessage}</S.ErrorText>}
      <BaseRow justify={'center'}>
        <S.SendFormButton
          disabled={loading || isLoading || inValidAmount || errorMessage !== null}
          onClick={handleSend}
          size="large"
          type="primary"
        >
          Send
        </S.SendFormButton>
      </BaseRow>
    </S.FormSpacer>
  );

  return (
    <BaseSpin spinning={isLoading || loading}>
      <S.SendBody justify={'center'}>
        <S.FormSpacer>
          <S.FormHeader>Send</S.FormHeader>
          {isDetailsOpen ? (
            <>
              <S.Recipient>
                To:
                <br />
                <S.AddressText>{truncateString(formData.address, 65)}</S.AddressText>
              </S.Recipient>
              {detailsPanel()}
            </>
          ) : (
            receiverPanel()
          )}
        </S.FormSpacer>
      </S.SendBody>
    </BaseSpin>
  );
};

export default SendForm;


// import React, { useEffect, useState } from 'react';
// import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
// import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
// import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
// import { useResponsive } from '@app/hooks/useResponsive';
// import { BaseSpin } from '@app/components/common/BaseSpin/BaseSpin';
// import * as S from './SendForm.styles';
// import { truncateString } from '@app/utils/utils';
// import useBalanceData from '@app/hooks/useBalanceData';
// import { BaseCheckbox } from '@app/components/common/BaseCheckbox/BaseCheckbox';
// import config from '@app/config/config';
// import TieredFees from './components/TieredFees/TieredFees';

// interface SendFormProps {
//   onSend: (status: boolean, address: string, amount: number, txid?: string, message?: string) => void;
// }

// interface PendingTransaction {
//   txid: string;
//   feeRate: number;
//   timestamp: string; // ISO format string
//   amount: string;
//   recipient_address: string;
// }

// export type tiers = 'low' | 'med' | 'high';

// const SendForm: React.FC<SendFormProps> = ({ onSend }) => {
//   const { balanceData, isLoading } = useBalanceData();

//   const [loading, setLoading] = useState(false);

//   const [isDetailsOpen, setIsDetailsOpen] = useState(false);

//   const [inValidAmount, setInvalidAmount] = useState(false);
//   const [addressError, setAddressError] = useState(false);

//   const [amountWithFee, setAmountWithFee] = useState<number | null>(null);

//   const [fee, setFee] = useState<number>(0);
//   const [formData, setFormData] = useState({
//     address: '',
//     amount: '1',
//   });

//   const [txSize, setTxSize] = useState<number | null>(null);

//   // Debounced effect to calculate transaction size when the amount changes
//   useEffect(() => {
//     const debounceTimeout = setTimeout(() => {
//       if (formData.amount.length > 0) {
//         // Call backend to calculate transaction size
//         const fetchTransactionSize = async () => {
//           try {
//             const response = await fetch('http://localhost:9003/calculate-tx-size', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({
//                 recipient_address: formData.address,
//                 spend_amount: parseInt(formData.amount),
//                 priority_rate: fee,  // Pass the fee rate
//               }),
//             });

//             const result = await response.json();
//             setTxSize(result.txSize);  // Set the transaction size
//           } catch (error) {
//             console.error('Error fetching transaction size:', error);
//             setTxSize(null);
//           }
//         };

//         fetchTransactionSize();
//       }
//     }, 500); // Debounce for 500ms

//     return () => clearTimeout(debounceTimeout); // Clear the timeout if the amount changes before 500ms
//   }, [formData.amount, fee]);

//   // Calculate the fee based on the transaction size
//   useEffect(() => {
//     if (txSize && fee) {
//       const estimatedFee = txSize * fee;
//       setAmountWithFee(parseInt(formData.amount) + estimatedFee);
//     }
//   }, [txSize, fee]);

//   // useEffect(() => {
//   //   setAmountWithFee(parseInt(formData.amount) + fee);
//   // }, [fee, formData.amount]);

//   const handleFeeChange = (fee: number) => {
//     setFee(fee);
//   };

//   const isValidAddress = (address: string) => {
//     return address.length > 0;
//   };

//   const handleAddressSubmit = () => {
//     const isValid = isValidAddress(formData.address);

//     if (isValid) {
//       setAddressError(false);
//       setIsDetailsOpen(true);
//     } else {
//       setAddressError(true);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     e.preventDefault();
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSend = async () => {
//     if (loading || inValidAmount) return;

//     setLoading(true);

//     const selectedFee = fee; // Default to low if not selected

//     const transactionRequest = {
//       choice: 1, // Default to choice 1 for new transactions
//       recipient_address: formData.address,
//       spend_amount: parseInt(formData.amount),
//       priority_rate: selectedFee,
//     };

//     try {
//       const response = await fetch('http://localhost:9003/transaction', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(transactionRequest),
//       });

//       const result = await response.json();
//       setLoading(false);

//       if (result.status === 'success') {
//         // Prepare the transaction details to send to the pending-transactions endpoint
//         const pendingTransaction: PendingTransaction = {
//           txid: result.txid,
//           feeRate: selectedFee,
//           timestamp: new Date().toISOString(), // Capture the current time in ISO format
//           amount: formData.amount,
//           recipient_address: formData.address, // Send the recipient address
//         };
      
//         // Send the transaction details to the pending-transactions endpoint
//         await fetch(`${config.baseURL}/pending-transactions`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(pendingTransaction),
//         });
      
//         // Call the onSend callback with the result
//         onSend(true, formData.address, transactionRequest.spend_amount, result.txid, result.message);
//       }
//        else {
//         onSend(false, formData.address, 0, '', result.message);
//       }
//     } catch (error) {
//       console.error('Transaction failed:', error);
//       setLoading(false);
//       onSend(false, formData.address, 0, '', 'Transaction failed due to a network error.');
//     }
//   };

//   useEffect(() => {
//     if (formData.amount.length <= 0 || (balanceData && parseInt(formData.amount) > balanceData.latest_balance)) {
//       setInvalidAmount(true);
//     } else {
//       setInvalidAmount(false);
//     }
//   }, [formData.amount]);

//   const receiverPanel = () => (
//     <>
//       <S.InputWrapper>
//         <S.InputHeader>Address</S.InputHeader>
//         <BaseInput name="address" value={formData.address} onChange={handleInputChange} placeholder="Send to" />
//       </S.InputWrapper>
//       <BaseButton onClick={handleAddressSubmit}>Continue</BaseButton>
//     </>
//   );

//   const detailsPanel = () => (
//     <S.FormSpacer>
//       <S.InputWrapper>
//         <S.TextRow>
//           <S.InputHeader>{`Amount = ${amountWithFee ? amountWithFee : ''}`}</S.InputHeader>

//           {inValidAmount && <S.ErrorText>Invalid Amount</S.ErrorText>}
//         </S.TextRow>

//         <div>
//           <BaseInput onChange={handleInputChange} name="amount" value={formData.amount} placeholder="Amount" />
//           <S.BalanceInfo>{`Balance: ${balanceData ? balanceData.latest_balance : 0}`}</S.BalanceInfo>
//         </div>
//       </S.InputWrapper>
//       <S.TiersContainer>
//         <S.InputHeader>Tiered Fees</S.InputHeader>
//         <S.RBFWrapper>
//           <BaseCheckbox />
//           RBF Opt In
//         </S.RBFWrapper>
//         <TieredFees inValidAmount={inValidAmount} handleFeeChange={handleFeeChange} txSize={txSize} />
//       </S.TiersContainer>
//       <BaseRow justify={'center'}>
//         <S.SendFormButton
//           disabled={loading || isLoading || inValidAmount}
//           onClick={handleSend}
//           size="large"
//           type="primary"
//         >
//           Send
//         </S.SendFormButton>
//       </BaseRow>
//     </S.FormSpacer>
//   );

//   return (
//     <BaseSpin spinning={isLoading || loading}>
//       <S.SendBody justify={'center'}>
//         <S.FormSpacer>
//           <S.FormHeader>Send</S.FormHeader>
//           {isDetailsOpen ? (
//             <>
//               <S.Recipient>
//                 To:
//                 <br />
//                 <S.AddressText>{truncateString(formData.address, 65)}</S.AddressText>
//               </S.Recipient>
//               {detailsPanel()}
//             </>
//           ) : (
//             receiverPanel()
//           )}
//         </S.FormSpacer>
//       </S.SendBody>
//     </BaseSpin>
//   );
// };

// export default SendForm;
