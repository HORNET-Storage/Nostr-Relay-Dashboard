import styled from 'styled-components';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';

export const SendModal = styled(BaseModal)`
  max-width: fit-content !important;
  width: fit-content !important; 
  .ant-modal-content {
    width:100%;
    min-width: 40vw;
    padding-left:2rem;
    padding-right:2rem; 

    }
`;
