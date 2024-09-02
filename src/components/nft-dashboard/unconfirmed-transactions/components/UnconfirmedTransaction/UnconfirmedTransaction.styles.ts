import styled from 'styled-components';

export const TransactionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1rem;
`;

export const DataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

export const Value = styled.span`
  font-size: 1.5rem;
  color: var(--text-main-color);
  font-weight: semibold;
`;
export const Label = styled.span`
  font-size: 1rem;
  color: var(--text-nft-light-color);
`;
