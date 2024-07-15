import { BaseLayout } from '@app/components/common/BaseLayout/BaseLayout';
import { BREAKPOINTS, LAYOUT } from '@app/styles/themes/constants';
import { media } from '@app/styles/themes/constants';
import styled, { css } from 'styled-components';

interface Header {
  $isTwoColumnsLayoutHeader: boolean;
  $isSiderOpened: boolean;
}

export const Header = styled(BaseLayout.Header)<Header>`
  line-height: 1.5;
  z-index: 100;
  ${(props) =>
    props.$isSiderOpened &&
    css`
      background-color: rgba(0, 0, 0, 0) !important;
      z-index: 105;
    `}
  position: sticky;
  position: -webkit-sticky;
  top: 0;

  @media only screen and ${media.md} {
    display: block;
    padding: ${LAYOUT.desktop.paddingVertical} ${LAYOUT.desktop.paddingHorizontal};
    height: ${LAYOUT.desktop.headerHeight};
  }

  @media only screen and ${media.md} {
    ${(props) =>
      props?.$isTwoColumnsLayoutHeader &&
      css`
        padding: 0;
      `}
  }

  @media only screen and (max-width: ${BREAKPOINTS.md}) {
    display: flex;
    align-items: center;
  }
  height: ${LAYOUT.mobile.headerHeight};
`;
