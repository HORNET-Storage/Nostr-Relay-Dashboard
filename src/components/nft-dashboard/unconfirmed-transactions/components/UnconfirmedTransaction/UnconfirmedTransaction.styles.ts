import styled, { css } from 'styled-components';

export const TransactionWrapper = styled.div`
  width: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const IDWrapper = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  ${({ $isMobile }) =>
    $isMobile &&
    css`
      width: 100%;
    `}
`;
export const TxIDWrapper = styled.span`
  font-size: 1rem;
  color: var(--text-main-color);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const DataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

export const Value = styled.span`
  font-size: 1rem;
  display: flex;
  justify-content: space-between;
  color: var(--text-main-color);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
export const Label = styled.span`
  font-size: 0.8rem;
  color: var(--text-nft-light-color);
`;

export const CopyWrapper = styled.span<{ $isDesktop: boolean }>`
  margin-right: 1.5rem;
  padding-left: 1rem;
  ${({ $isDesktop }) => $isDesktop && css`
  
  `}
`;
