import styled, { css } from 'styled-components';

export const ContentWrapper = styled.div`
  overflow-y: hidden;
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
 
  max-height: 50vh;
  
  display: flex;
  min-height: 20vh;
  height: 100%;
  flex-direction: column;
  gap: 1rem;
`;

export const TransactionWrapper = styled.div`
  display: flex;
  width: 80%;
`;
export const ButtonWrapper = styled.div`
  disply: flex;
  margin: 0.5rem;
`;

export const NoTransactionsText = styled.p`
  text-align: center;
  color: #888;
  font-size: 16px;
`;

export const RowWrapper = styled.div`
  padding: 0.5rem 1.5rem 0.5rem 0.5rem;
  border-radius: 0.5rem;
  box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.12), 0px 4px 5px rgba(0, 0, 0, 0.14), 0px 2px 4px -1px rgba(0, 0, 0, 0.2);
  background-color: var(--additional-background-color);
  display: flex;
  flex-direction: row;
  gap: 2rem;
  align-items: center;
`;
export const ScrollPanel = styled.div`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
`;