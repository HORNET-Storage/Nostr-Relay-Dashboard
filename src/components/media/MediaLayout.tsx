import React from 'react';
import { PageTitle } from '../common/PageTitle/PageTitle';
import * as S from './MediaLayout.styles';
import MediaManager from './MediaManager/MediaManager';
import { BaseRow } from '../common/BaseRow/BaseRow';
import { useResponsive } from '@app/hooks/useResponsive';
const MediaLayout: React.FC = () => {
  const { is4k } = useResponsive();
  return (
    <BaseRow>
      <PageTitle>Media Manager</PageTitle>
      <S.LeftSideCol>
        <S.MediaManagerWrapper>
          <S.PageHeader $is4kScreen={is4k} >Media Manager</S.PageHeader>
          <MediaManager />
        </S.MediaManagerWrapper>
      </S.LeftSideCol>
    </BaseRow>
  );
};

export default MediaLayout;
