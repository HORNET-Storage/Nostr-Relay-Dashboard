import styled from 'styled-components';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';

export const Modal = styled(BaseModal)`
  text-align: center;
  justify-content: center;
  .ant-modal-content {
    border-radius: 1rem;
    padding:1rem;
  }
  .ant-modal-body {
    padding: 1.5rem;
    min-height: 30vh;
  }
`;

export const MediaWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 25vh;
  height: 100%;
`;

export const NotSupported = styled.div`
  font-size: 1rem;
  height: 100%;
  display: flex;
  justify-content: center;
`;
