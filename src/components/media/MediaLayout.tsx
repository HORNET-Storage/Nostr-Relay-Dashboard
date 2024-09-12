import React from 'react';
import { PageTitle } from '../common/PageTitle/PageTitle';
import * as S from './MediaLayout.styles';
import MediaManager from './MediaManager/MediaManager';
const MediaLayout: React.FC = () => {
  return (
    <>
      <PageTitle>Media Manager</PageTitle>
      <S.MediaManagerWrapper>
        <S.PageHeader>Media Manager</S.PageHeader>
        <MediaManager />
      </S.MediaManagerWrapper>
    </>
  );
};

export default MediaLayout;