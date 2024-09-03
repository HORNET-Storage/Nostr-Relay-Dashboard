import styled, { css } from 'styled-components';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';

export const TierCard = styled(BaseCard)<{ $isMobile?: boolean }>`
  width: 30%;
  ${(props) =>
    props.$isMobile &&
    css`
      width: 100%;
    `}
  background-color: var(--additional-background-color);
  cursor: pointer;
  box-shadow: 0px 0px 10px 0px var(--shadow-color);

  .ant-card-body {
    padding: 1rem 2rem;
  }
`;

export const TierCardHeader = styled.span`
  font-size: 1.5rem;
`;
export const TierCardAmount = styled.span`
  font-size: 1.5rem;
`;
export const TierCardContent = styled.div`
  font-size: 1.3rem;
  height: 100%;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 3rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
`;

export const RateValueWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
export const RateValue = styled.span`
  color: green;
`;
interface ResponsiveProps {
  isMobile: boolean;
}
export const TiersWrapper = styled.div<ResponsiveProps>`
  ${(props) =>
    props.isMobile &&
    css`
      display: flex;
      flex-direction: column;
      gap: 1rem;
    `}
  display: flex;
  flex-direction: row;
  gap: 1rem;
  width: 100%;
  justify-content: space-around;

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
