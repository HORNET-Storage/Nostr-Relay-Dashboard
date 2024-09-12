import React from 'react';
import { PageTitle } from '../common/PageTitle/PageTitle';
import * as S from './MediaLayout.styles';
import MediaManager from './MediaManager/MediaManager';
import { BaseRow } from '../common/BaseRow/BaseRow';
const MediaLayout: React.FC = () => {
  return (
    <BaseRow>
      <PageTitle>Media Manager</PageTitle>
      <S.LeftSideCol >
        <S.MediaManagerWrapper>
          <S.PageHeader>Media Manager</S.PageHeader>
          <MediaManager />
        </S.MediaManagerWrapper>
      </S.LeftSideCol>
    </BaseRow>
  );
};

export default MediaLayout;
