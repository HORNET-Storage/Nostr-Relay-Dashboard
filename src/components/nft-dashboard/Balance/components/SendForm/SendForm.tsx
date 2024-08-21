import React, { memo, useEffect, useState } from 'react';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { useResponsive } from '@app/hooks/useResponsive';
import { BaseSpin } from '@app/components/common/BaseSpin/BaseSpin';
import * as S from './SendForm.styles';
import { truncateString } from '@app/utils/utils';
import useBalanceData from '@app/hooks/useBalanceData';

interface SendFormProps {
  onSend: (status: boolean, address: string, amount: number) => void;
}
interface SuccessScreenProps {
  isSuccess: boolean;
  amount: number;
  address: string;
}
const subscriptionDuration = 30; //1 month

const testTiers = [
  {
    id: 'tier1',
    limit: '1 GB',
    amount: 10000,
  },
  {
    id: 'tier2',
    limit: '5 GB',
    amount: 40000,
  },
  {
    id: 'tier3',
    limit: '10 GB',
    amount: 70000,
  },
];

type tiers = 'tier1' | 'tier2' | 'tier3';
const SendForm: React.FC<SendFormProps> = ({ onSend }) => {
  const { balanceData, isLoading } = useBalanceData();
  const { isTablet, isDesktop } = useResponsive();
  const [loading, setLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<tiers | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [inValidAmount, setInvalidAmount] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    amount: '',
    tier: '',
  });

  const handleTierChange = (tier: any) => {
    setSelectedTier(tier.id);
    setFormData({ ...formData, amount: tier.amount });
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
      onSend(true, formData.address, parseInt(formData.amount));
    }, 2000);
  };

  useEffect(() => {
    if (formData.amount.length <= 0 || (balanceData && parseInt(formData.amount) > balanceData.latest_balance)) {
      setInvalidAmount(true);
    } else {
      setInvalidAmount(false);
    }
  }, [formData.amount]);
  const ReceiverPanel = memo(() => {
    return (
      <>
        <S.InputWrapper>
        <S.InputHeader>Address</S.InputHeader>
          <BaseInput name="address" value={formData.address} onChange={handleInputChange} placeholder="Send to" />
        </S.InputWrapper>
        <BaseButton onClick={handleAddressSubmit}>Continue</BaseButton>
      </>
    );
  });
  const DetailsPanel = () => {
    return (
      <S.FormSpacer>
        <S.InputWrapper>
          <S.TextRow>
            <S.InputHeader>Amount</S.InputHeader>
            {inValidAmount && selectedTier && <S.ErrorText>Amount exceeds balance</S.ErrorText>}
          </S.TextRow>
          <div>
            <BaseInput value={formData.amount} placeholder="Amount" />
            <S.BalanceInfo>{` Balance: ${balanceData ? balanceData.latest_balance : 0}`} </S.BalanceInfo>
          </div>
        </S.InputWrapper>
        <S.TiersContainer>
          <S.InputHeader>Tiers</S.InputHeader>
          {isDesktop || isTablet ? (
            <S.TiersRow>
              {testTiers.map((tier) => (
                <S.SubCard
                  onClick={() => handleTierChange(tier)}
                  className={`tier-hover ${selectedTier == tier.id ? 'selected' : ' '} ${
                    selectedTier == tier.id && inValidAmount ? 'invalidAmount' : ' '
                  } `}
                >
                  <S.SubCardContent>
                    <S.SubCardAmount>{`${tier.amount} Sats`}</S.SubCardAmount>
                    <span> {`${tier.limit} per Month`}</span>
                  </S.SubCardContent>
                </S.SubCard>
              ))}
            </S.TiersRow>
          ) : (
            <S.TiersCol>
              {testTiers.map((tier) => (
                <S.SubCard
                  onClick={() => handleTierChange(tier)}
                  className={`tier-hover ${selectedTier == tier.id ? 'selected' : ' '} ${
                    selectedTier == tier.id && inValidAmount ? 'invalidAmount' : ' '
                  } `}
                >
                  <S.SubCardContent>
                    <S.SubCardAmount>{`${tier.amount} Sats`}</S.SubCardAmount>
                    <span> {`${tier.limit} per Month`}</span>
                  </S.SubCardContent>
                </S.SubCard>
              ))}
            </S.TiersCol>
          )}
        </S.TiersContainer>
        <BaseRow justify={'center'}>
          <S.SendFormButton disabled={loading || isLoading} onClick={handleSend} size="large" type="primary">
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
              <DetailsPanel></DetailsPanel>
            </>
          ) : (
            <ReceiverPanel></ReceiverPanel>
          )}
        </S.FormSpacer>
      </S.SendBody>
    </BaseSpin>
  );
};

export default SendForm;
