import styled from 'styled-components';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';

export const Modal = styled(BaseModal)`
  max-width: fit-content !important;
  width: fit-content !important;
  min-width: 50vw;

  .ant-modal-body {
    height: 100%;
    padding-bottom: 0;
  }
  .ant-modal-content {
    min-height: 50vh;
    width: 100%;
    min-width: 50vw;
    padding: 2rem;
  }
`;
