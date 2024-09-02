import React, { memo, useEffect, useState } from 'react';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { useResponsive } from '@app/hooks/useResponsive';
import { BaseSpin } from '@app/components/common/BaseSpin/BaseSpin';
import * as S from './SendForm.styles';
import { truncateString } from '@app/utils/utils';
import useBalanceData from '@app/hooks/useBalanceData';
import { BaseCheckbox } from '@app/components/common/BaseCheckbox/BaseCheckbox';
interface SendFormProps {
  onSend: (status: boolean, address: string, amount: number) => void;
}
interface SuccessScreenProps {
  isSuccess: boolean;
  amount: number;
  address: string;
}

const testTiers = [
  {
    id: 'low',
    rate: 4,
  },
  {
    id: 'med',
    rate: 5,
  },
  {
    id: 'high',
    rate: 5,
  },
];

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
    if (address.length > 0) {
      return true;
    }
    return false;
  };

  const handleAddressSubmit = () => {
    //check if valid address
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
  const handleSend = () => {
    if (loading) return;
    if (inValidAmount) return;

    setLoading(true);

    //send request here  (simulating request for now)
    console.log('Sending data', formData);
    setTimeout(() => {
      setLoading(false);
      onSend(true, formData.address, amountWithFee ? amountWithFee : 0);
    }, 2000);
  };

  useEffect(() => {
    if (selectedTier) {
      const vB = parseInt(formData.amount) / 50;
      const lowFee = Math.ceil(vB * testTiers[0].rate);
      const medFee = Math.ceil(vB * testTiers[1].rate);
      const highFee = Math.ceil(vB * testTiers[2].rate);

      setFees({ low: lowFee, med: medFee, high: highFee });
    }
  }, [formData.amount, selectedTier]); //fetched fees should be used here

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

  const receiverPanel = () => {
    return (
      <>
        <S.InputWrapper>
          <S.InputHeader>Address</S.InputHeader>
          <BaseInput name="address" value={formData.address} onChange={handleInputChange} placeholder="Send to" />
        </S.InputWrapper>
        <BaseButton onClick={handleAddressSubmit}>Continue</BaseButton>
      </>
    );
  };
  const TieredFees = () => {
    return (
      <>
        <S.SubCard
          $isMobile={!isDesktop}
          onClick={() => handleTierChange(testTiers[0])}
          className={`tier-hover ${selectedTier == testTiers[0].id ? 'selected' : ' '} ${
            selectedTier == testTiers[0].id && inValidAmount ? 'invalidAmount' : ' '
          } `}
        >
          <S.SubCardContent>
            <S.SubCardAmount>
              {`Low`}
              <br />
              {`Priority`}
            </S.SubCardAmount>
            <S.RateValueWrapper>
              <span> {`${testTiers[0].rate} sat/vB`}</span>
              <S.RateValue>{`${fees?.low} Sats`}</S.RateValue>
            </S.RateValueWrapper>
          </S.SubCardContent>
        </S.SubCard>

        <S.SubCard
          $isMobile={!isDesktop}
          onClick={() => handleTierChange(testTiers[1])}
          className={`tier-hover ${selectedTier == testTiers[1].id ? 'selected' : ' '} ${
            selectedTier == testTiers[1].id && inValidAmount ? 'invalidAmount' : ' '
          } `}
        >
          <S.SubCardContent>
            <S.SubCardAmount>
              {`Medium`}
              <br />
              {`Priority`}
            </S.SubCardAmount>
            <S.RateValueWrapper>
              <span> {`${testTiers[1].rate} sat/vB`}</span>
              <S.RateValue>{`${fees?.med} Sats`}</S.RateValue>
            </S.RateValueWrapper>
          </S.SubCardContent>
        </S.SubCard>

        <S.SubCard
          $isMobile={!isDesktop}
          onClick={() => handleTierChange(testTiers[2])}
          className={`tier-hover ${selectedTier == testTiers[2].id ? 'selected' : ' '} ${
            selectedTier == testTiers[2].id && inValidAmount ? 'invalidAmount' : ' '
          } `}
        >
          <S.SubCardContent>
            <S.SubCardAmount>
              {`High`}
              <br />
              {`Priority`}
            </S.SubCardAmount>
            <S.RateValueWrapper>
              <span> {`${testTiers[2].rate} sat/vB`}</span>
              <S.RateValue>{`${fees?.high} Sats`}</S.RateValue>
            </S.RateValueWrapper>
          </S.SubCardContent>
        </S.SubCard>
      </>
    );
  };
  const detailsPanel = () => {
    return (
      <S.FormSpacer>
        <S.InputWrapper>
          <S.TextRow>
            <S.InputHeader>{`Amount = ${selectedTier && amountWithFee ? amountWithFee : ''} `} </S.InputHeader>

            {inValidAmount && selectedTier && <S.ErrorText>Invalid Amount</S.ErrorText>}
          </S.TextRow>

          <div>
            <BaseInput onChange={handleInputChange} name="amount" value={formData.amount} placeholder="Amount" />
            <S.BalanceInfo>{` Balance: ${balanceData ? balanceData.latest_balance : 0}`} </S.BalanceInfo>
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
  };
  return (
    <BaseSpin spinning={isLoading || loading}>
      <S.SendBody justify={'center'}>
        <S.FormSpacer>
          <S.FormHeader>Send</S.FormHeader>
          {isDetailsOpen ? (
            <>
              <S.Recipient>
                {`To:`}
                <br></br>
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
