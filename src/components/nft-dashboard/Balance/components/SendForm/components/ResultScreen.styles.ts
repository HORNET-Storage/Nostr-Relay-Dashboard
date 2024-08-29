import styled from 'styled-components';

export const ResultScreenWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;
export const ResultTextPass = styled.span`
  color: green;
  font-size: 2rem;
`;
export const ResultTextFail = styled.span`
  color: red;
  font-size: 2rem;
`;
export const ResultMessage = styled.span`
  font-size: 1.5rem;
  text-align: center;
  padding: 1rem;
`;