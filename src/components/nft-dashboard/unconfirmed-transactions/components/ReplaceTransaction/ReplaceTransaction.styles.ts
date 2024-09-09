import styled, { css } from 'styled-components';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';

interface ResponsiveProps {
  isMobile: boolean;
}
export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FieldDisplay = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ValueWrapper = styled.div<ResponsiveProps>`
  ${(props) =>
    props.isMobile &&
    css`
      width: 100%;
    `}
  width: 90%;
  padding: 1rem;
  margin-left:1rem;
  background-color: var(--additional-background-color);
  border-radius: 0.5rem;
`;
export const FieldLabel = styled.span`
  font-size: 1.2rem;
  color: var(--text-main-color);
  font-weight: semibold;
`;
export const FieldValue = styled.span`
  font-size: 1rem;
  color: var(--text-main-color);
`;

export const ButtonRow = styled.div`
    padding-top: 1rem;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    justify-content: center;
    pading: .5rem 2rem;
    `;

export const Button = styled(BaseButton)`

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

export const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
`;

export const CustomFeeInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const ToggleCustomFee = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;