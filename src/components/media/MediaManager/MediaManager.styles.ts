import styled from 'styled-components';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';

export const MediaManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ToolBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  width: 100%;
  padding-right: 1rem;
`;

export const MediaItemsContainer = styled.div`
  padding-top: 2rem;
`;

export const ToolBarButton = styled(BaseButton)`
  font-size: 0.8rem;
`