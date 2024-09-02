import styled from 'styled-components';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';

export const Modal = styled(BaseModal)`
  max-width: fit-content !important;
  width: fit-content !important;
  min-width: 50vw;  

  .ant-modal-content {
    width: 100%;
    min-width: 50vw;
    padding: 2rem;
  }
`;