import styled, { css } from 'styled-components';
import { LAYOUT, media } from '@app/styles/themes/constants';
import { BaseCol } from '../common/BaseCol/BaseCol';
export const MediaManagerWrapper = styled.div`
  padding: 1rem;
`;

export const PageHeader = styled.h2<{ $is4kScreen?: boolean }>`
  padding-bottom: 1rem;
${(props) =>
    props.$is4kScreen &&
    css`
      font-size: 2rem;
    `}  
  `;
export const LeftSideCol = styled(BaseCol)`
  @media only screen and ${media.xl} {
    padding: 0 0 ${LAYOUT.desktop.paddingVertical} 0;
    height: calc(100vh - ${LAYOUT.desktop.headerHeight});
    overflow: auto;
  }
`;
