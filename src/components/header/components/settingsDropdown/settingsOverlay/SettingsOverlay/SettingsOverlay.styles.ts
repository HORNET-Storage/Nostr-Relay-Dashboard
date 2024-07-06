import { BaseRadio } from '@app/components/common/BaseRadio/BaseRadio';
import { media } from '@app/styles/themes/constants';
import { BaseTypography } from '@app/components/common/BaseTypography/BaseTypography';
import styled from 'styled-components';

export const SettingsOverlayMenu = styled.div`
  width: 13rem;
`;

export const RadioBtn = styled(BaseRadio)`
  font-size: 0.875rem;
`;

export const PwaInstallWrapper = styled.div`
  padding: 0 1rem 0.75rem;
`;

export const Text = styled(BaseTypography.Text)`
  display: flex;
  align-items: center;
  justify-content: start;
  padding-left: 1rem;
  height: 50px;
  font-size: 0.89rem;
  font-weight: 600;

  & > a {
    display: block;
  }

  @media only screen and ${media.md} {
    font-size: 1rem;
  }
`;
