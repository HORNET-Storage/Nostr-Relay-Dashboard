import styled from 'styled-components';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
export const ContentWrapper = styled.div`
  display: row;
  flex-direction: row;
  gap: 2rem;
`;
export const TextRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
`;

export const SubCard = styled(BaseCard)`
  background-color: var(--additional-background-color);
  cursor: pointer;
  box-shadow: 0px 0px 10px 0px var(--shadow-color);
  .ant-card-body {
    padding: 1rem 2rem;
  }
`;
export const SendBody = styled(BaseRow)`
  padding-bottom: 1rem;
`;
export const FormSpacer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
export const FormHeader = styled.span`
  display: flex;
  font-size: 2rem;
  align-items: center;
  text-align: center;
  justify-content: center;
  width: 100%;
  padding-bottom: 1rem;
`;

export const SubCardHeader = styled.span`
  font-size: 1.5rem;
`;

export const InputHeader = styled.span`
  font-size: 1.5rem ; 
  
`;

export const SubCardAmount = styled.span`
  font-size: 1.5rem;
`;
export const SubCardContent = styled.div`
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 3rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
`;

export const InputWrapper = styled.div`
  display: flex;
  min-width: 25vw;
  flex-direction: column;
  gap: 0.5rem;
`;
export const TiersRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-content: space-around;
`;

export const TiersCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: space-around;
`;
export const SendFormButton = styled(BaseButton)`
  width: 100%;
`;
export const TiersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all 0.5s ease;
  padding: 1rem;
  .tier-hover:hover {
    background-color: var(--primary-color);
  }
  .selected {
    border: 1px solid var(--primary-color);
  }
  .invalidAmount {
    border: 1px solid var(--error-color);
  }
`;
export const BalanceInfo = styled.small`
  color: var(--subtext-color);
`;

export const Recipient = styled.span`
  color: var(--subtext-color);
  word-break: break-all;
`;
export const ErrorText = styled.small`
  color: var(--error-color);
  display: flex;
  flex-direction: row;
  align-items: center;
`;
export const AddressText = styled.span`
  text-decoration: underline;
  color: var(--text-main-color);
`;

export const RateValueWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
export const RateValue = styled.span`
  color: green;
`;
export const RBFWrapper = styled.div`

  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
  justify-content: center;
`;
