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

interface SendFormProps {
  onSend: (status: boolean, address: string, amount: number, txid?: string, message?: string) => void;
}

interface FeeRecommendation {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
}

interface PendingTransaction {
  txid: string;
  feeRate: number;
  timestamp: string; // ISO format string
}

type tiers = 'low' | 'med' | 'high';
type Fees = {
  [key in tiers]: number;
};

const SendForm: React.FC<SendFormProps> = ({ onSend }) => {
  const { balanceData, isLoading } = useBalanceData();
  const { isTablet, isDesktop } = useResponsive();
  const [loading, setLoading] = useState(false);

  const [selectedTier, setSelectedTier] = useState<tiers | null>('low');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [inValidAmount, setInvalidAmount] = useState(false);
  const [addressError, setAddressError] = useState(false);

  const [amountWithFee, setAmountWithFee] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    address: '',
    amount: '1',
  });

  const [fees, setFees] = useState<Fees>({ low: 0, med: 0, high: 0 });

  const handleTierChange = (tier: any) => {
    setSelectedTier(tier.id);
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

    const selectedFee = selectedTier ? fees[selectedTier] : fees.low; // Default to low if not selected

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
    const fetchFees = async () => {
      try {
        const response = await fetch('https://mempool.space/api/v1/fees/recommended');
        const data: FeeRecommendation = await response.json();

        setFees({
          low: data.economyFee,
          med: data.halfHourFee,
          high: data.fastestFee,
        });
      } catch (error) {
        console.error('Failed to fetch fees:', error);
      }
    };

    fetchFees();
  }, []);

  useEffect(() => {
    if (selectedTier) {
      setAmountWithFee(parseInt(formData.amount) + fees[selectedTier]);
    }
  }, [fees]);

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
        <S.InputHeader>Address</S.InputHeader>
        <BaseInput name="address" value={formData.address} onChange={handleInputChange} placeholder="Send to" />
      </S.InputWrapper>
      <BaseButton onClick={handleAddressSubmit}>Continue</BaseButton>
    </>
  );

  const TieredFees = () => (
    <>
      <S.SubCard
        $isMobile={!isDesktop}
        onClick={() => handleTierChange({ id: 'low', rate: fees.low })}
        className={`tier-hover ${selectedTier === 'low' ? 'selected' : ''} ${
          selectedTier === 'low' && inValidAmount ? 'invalidAmount' : ''
        } `}
      >
        <S.SubCardContent>
          <S.SubCardAmount>
            {' '}
            {`Low`}
            <br />
            {`Priority`}
          </S.SubCardAmount>
          <S.RateValueWrapper>
            <span>{`${fees.low} sat/vB`}</span>
            <S.RateValue>{`${fees.low} Sats`}</S.RateValue>
          </S.RateValueWrapper>
        </S.SubCardContent>
      </S.SubCard>

      <S.SubCard
        $isMobile={!isDesktop}
        onClick={() => handleTierChange({ id: 'med', rate: fees.med })}
        className={`tier-hover ${selectedTier === 'med' ? 'selected' : ''} ${
          selectedTier === 'med' && inValidAmount ? 'invalidAmount' : ''
        } `}
      >
        <S.SubCardContent>
          {`Medium`}
          <br />
          {`Priority`}
          <S.RateValueWrapper>
            <span>{`${fees.med} sat/vB`}</span>
            <S.RateValue>{`${fees.med} Sats`}</S.RateValue>
          </S.RateValueWrapper>
        </S.SubCardContent>
      </S.SubCard>

      <S.SubCard
        $isMobile={!isDesktop}
        onClick={() => handleTierChange({ id: 'high', rate: fees.high })}
        className={`tier-hover ${selectedTier === 'high' ? 'selected' : ''} ${
          selectedTier === 'high' && inValidAmount ? 'invalidAmount' : ''
        } `}
      >
        <S.SubCardContent>
          <S.SubCardAmount>
            {' '}
            {`High`}
            <br />
            {`Priority`}
          </S.SubCardAmount>
          <S.RateValueWrapper>
            <span>{`${fees.high} sat/vB`}</span>
            <S.RateValue>{`${fees.high} Sats`}</S.RateValue>
          </S.RateValueWrapper>
        </S.SubCardContent>
      </S.SubCard>
    </>
  );

  const detailsPanel = () => (
    <S.FormSpacer>
      <S.InputWrapper>
        <S.TextRow>
          <S.InputHeader>{`Amount = ${selectedTier && amountWithFee ? amountWithFee : ''}`}</S.InputHeader>

          {inValidAmount && selectedTier && <S.ErrorText>Invalid Amount</S.ErrorText>}
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
        {isDesktop || isTablet ? (
          <S.TiersRow>
            <TieredFees />
          </S.TiersRow>
        ) : (
          <S.TiersCol>
            <TieredFees />
          </S.TiersCol>
        )}
      </S.TiersContainer>
      <BaseRow justify={'center'}>
        <S.SendFormButton
          disabled={loading || isLoading || inValidAmount}
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
