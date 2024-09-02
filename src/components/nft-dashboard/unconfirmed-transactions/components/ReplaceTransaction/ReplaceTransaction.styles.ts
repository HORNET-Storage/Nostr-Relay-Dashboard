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
  width: 50%;
  padding: 1rem;
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
    display: flex;
    flex-direction: row;
    gap: 1rem;
    justify-content: center;
    pading: .5rem 2rem;
    `;

export const Button = styled(BaseButton)`

`;
