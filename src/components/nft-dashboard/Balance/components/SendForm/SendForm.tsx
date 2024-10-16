import React, { useEffect, useState, useCallback } from 'react';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpin } from '@app/components/common/BaseSpin/BaseSpin';
import * as S from './SendForm.styles';
import { truncateString } from '@app/utils/utils';
import useBalanceData from '@app/hooks/useBalanceData';
import { BaseCheckbox } from '@app/components/common/BaseCheckbox/BaseCheckbox';
import config from '@app/config/config';
import TieredFees from './components/TieredFees/TieredFees';
import useWalletAuth from '@app/hooks/useWalletAuth'; // Import the auth hook
import { deleteWalletToken, readToken } from '@app/services/localStorage.service'; // Assuming this is where deleteWalletToken is defined
import { bech32 } from 'bech32';
interface SendFormProps {
  onSend: (status: boolean, address: string, amount: number, txid?: string, message?: string) => void;
}

interface PendingTransaction {
  txid: string;
  feeRate: number;
  timestamp: string; // ISO format string
  amount: number;
  recipient_address: string;
  enable_rbf: boolean;
}

export type tiers = 'low' | 'med' | 'high';

const SendForm: React.FC<SendFormProps> = ({ onSend }) => {
  const { balanceData, isLoading } = useBalanceData();
  const { isAuthenticated, login, token, loading: authLoading } = useWalletAuth(); // Use the auth hook

  const [loading, setLoading] = useState(false);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [inValidAmount, setInvalidAmount] = useState(false);
  const [addressError, setAddressError] = useState(false);

  const [amountWithFee, setAmountWithFee] = useState<number | null>(null);

  const [fee, setFee] = useState<number>(0);
  const [feeRate, setFeeRate] = useState<number>(0);
  const [formData, setFormData] = useState({
    address: '',
    amount: '1',
  });

  const [txSize, setTxSize] = useState<number | null>(null);

  const [enableRBF, setEnableRBF] = useState(false); // Default to false

  // Debounced effect to calculate transaction size when the amount changes, with JWT
  useEffect(() => {

    const debounceTimeout = setTimeout(() => {
      const fetchTransactionSize = async () => {
        if (isValidAddress(formData.address) && isDetailsOpen) {
          //this should use bech32 regex
          try {
            // Ensure user is authenticated
            if (!isAuthenticated) {
              console.log('Not Authenticated.');
              await login(); // Perform login if not authenticated
            }

            const response = await fetch(`${config.walletBaseURL}/calculate-tx-size`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Include JWT token in headers
              },
              body: JSON.stringify({
                recipient_address: formData.address,
                spend_amount: parseInt(formData.amount),
                priority_rate: feeRate,
              }),
            });

            if (response.status === 401) {
              const errorText = await response.text();
              if (errorText.includes('Token expired') || errorText.includes('Unauthorized: Invalid token')) {
                // Token has expired, trigger a re-login
                console.log('Session expired. Please log in again.');
                deleteWalletToken(); // Clear the old token
                await login(); // Re-initiate login
              }
              throw new Error(errorText);
            }

            const result = await response.json();
            setTxSize(result.txSize);
          } catch (error) {
            console.error('Error fetching transaction size:', error);
            setTxSize(null);
          }
        }
      };

      fetchTransactionSize();
    }, 500); // Debounce for 500ms

    return () => clearTimeout(debounceTimeout); // Clear the timeout if the amount changes before 500ms
  }, [formData.amount, feeRate, isAuthenticated, login, token]);

  // Calculate the fee based on the transaction size
  useEffect(() => {
    const estimatedFee = txSize ? txSize * feeRate : 0; // Calculate the fee based on the tx size and fee rate
    setFee(estimatedFee);
  }, [txSize, feeRate]);

  useEffect(() => {
    setAmountWithFee(parseInt(formData.amount) + fee); // Update the amount with fee when the fee changes
  }, [fee, formData.amount]);

  const handleFeeRateChange = useCallback((fee: number) => {
    setFeeRate(fee); // Update the new fee when it changes
  }, []);


  function validateBech32Address(address: string) {
    try {
      const decoded = bech32.decode(address);
      const validPrefixes = ['bc', 'tb']; // 'bc' for mainnet, 'tb' for testnet
      if (validPrefixes.includes(decoded.prefix)) {
        return true;
      } else {
        console.log('Invalid prefix.');
        return false;
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error('Invalid Bech32 address:', err.message);
      } else {
        console.error('Invalid Bech32 address:', err);
      }
      return false;
    }
  }

  const isValidAddress = (address: string) => {
    //TODO: add some sort of bech32 regex here
    if (address.length === 0) {
      return false;
    }
    return validateBech32Address(address);
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

    const selectedFee = feeRate; // The user-selected fee rate

    const transactionRequest = {
      choice: 1, // New transaction option
      recipient_address: formData.address,
      spend_amount: parseInt(formData.amount),
      priority_rate: selectedFee,
      enable_rbf: enableRBF,
    };

    try {
      // Step 1: Ensure the user is authenticated
      if (!isAuthenticated) {
        await login(); // Perform login if not authenticated
      }


      // Step 2: Initiate the new transaction with the JWT token
      const response = await fetch(`${config.walletBaseURL}/transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include JWT token in headers
        },
        body: JSON.stringify(transactionRequest),
      });

      if (response.status === 401) {
        const errorText = await response.text();
        if (errorText.includes('Token expired') || errorText.includes('Unauthorized: Invalid token')) {
          // Token has expired, trigger a re-login
          console.log('Session expired. Please log in again.');
          deleteWalletToken(); // Clear the old token
          await login(); // Re-initiate login
        }
        throw new Error(errorText);
      }

      const result = await response.json();

      // Check the status from the wallet's response
      if (result.status === 'success' || result.status === 'pending') {
        // Step 2: If the transaction succeeds or is pending, update the pending transactions
        const pendingTransaction: PendingTransaction = {
          txid: result.txid,
          feeRate: Math.round(selectedFee), // Ensure feeRate is an integer
          timestamp: new Date().toISOString(), // Already in correct ISO format expected by Go's time.Time
          amount: parseInt(formData.amount, 10), // Parse amount as an integer
          recipient_address: formData.address,
          enable_rbf: enableRBF, // Already boolean and correct
        };

        // Fetch the JWT token using readToken()
        const pendingToken = readToken();

        const pendingResponse = await fetch(`${config.baseURL}/api/pending-transactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${pendingToken}`, // Use the token from readToken()
          },
          body: JSON.stringify(pendingTransaction),
        });

        const pendingResult = await pendingResponse.json();

        // Step 3: Handle the final result from updating pending transactions
        if (pendingResponse.ok) {
          setLoading(false);
          onSend(true, formData.address, transactionRequest.spend_amount, result.txid, pendingResult.message); // Notify parent
        } else {
          setLoading(false);
          onSend(false, formData.address, 0, '', pendingResult.error || 'Failed to save pending transaction.');
        }
      } else {
        // Handle error in the wallet's transaction response
        setLoading(false);
        onSend(false, formData.address, 0, '', result.message || 'Transaction failed.');
      }
    } catch (error) {
      console.error('Transaction failed:', error);
      setLoading(false);
      onSend(false, formData.address, 0, '', 'Transaction failed due to a network error.');
    } finally {
      setLoading(false); // Ensure loading stops in all cases
    }
  };

  useEffect(() => {
    if (formData.amount.length <= 0 || (balanceData && parseInt(formData.amount) > balanceData.latest_balance)) {
      setInvalidAmount(true);
    } else {
      setInvalidAmount(false);
    }
  }, [formData.amount]);

  const receiverPanel = () => (
    <>
      <S.InputWrapper>
        <S.InputHeaderWrapper>
          <S.InputHeader>Address</S.InputHeader>
          {addressError && <S.ErrorText>Invalid Address</S.ErrorText>}
        </S.InputHeaderWrapper>
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
          <BaseCheckbox
            checked={enableRBF}
            onChange={(e) => setEnableRBF(e.target.checked)} // Update the state when the checkbox is toggled
          />
          RBF Opt In
        </S.RBFWrapper>
        <TieredFees
          invalidAmount={inValidAmount} // Note: 'invalidAmount' property is now camelCase to match prop names
          handleFeeChange={handleFeeRateChange}
          transactionSize={txSize} // Pass the transaction size value
          originalFeeRate={0} // Pass 0 or appropriate value for new transactions
        />

      </S.TiersContainer>
      <BaseRow justify={'center'}>
        <S.SendFormButton
          disabled={loading || isLoading || inValidAmount || authLoading || addressError}
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
    <BaseSpin spinning={isLoading || loading || authLoading}>
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
