import styled from 'styled-components';

export const TransactionWrapper = styled.div`
  width: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1rem;
`;

export const IDWrapper = styled.div`
  display: flex;
  width: 40%;
  flex-direction: column;
  gap: 0.3rem;
`;

export const DataWrapper = styled.div`
  display: flex;
  width: 22%;
  flex-direction: column;
  gap: 0.3rem;
`;

export const Value = styled.span`
  font-size: 1rem;
  color: var(--text-main-color);
  font-weight: semibold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
export const Label = styled.span`
  font-size: 0.8rem;
  color: var(--text-nft-light-color);
`;
