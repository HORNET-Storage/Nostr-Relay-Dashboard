import styled, { css } from 'styled-components';

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
export const PanelHeaderText = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  padding-bottom: 1rem;
`;
export const PanelContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const TransactionWrapper = styled.div`
  display: flex;
  width: 80%;
`;
export const ButtonWrapper = styled.div`
  disply: flex;
  margin: .5rem;
`;

export const NoTransactionsText = styled.p`
  text-align: center;
  color: #888;
  font-size: 16px;
`;

export const RowWrapper = styled.div`
padding: .5rem 1.5rem .5rem .5rem;
  border-radius: 0.5rem;
 box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.12), 0px 4px 5px rgba(0, 0, 0, 0.14), 0px 2px 4px -1px rgba(0, 0, 0, 0.2);
  background-color: var(--additional-background-color);
  display: flex;
  flex-direction: row;
  gap: 2rem;
  align-items: center;
`;
