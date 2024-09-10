import React, { useState } from 'react';
import * as S from './MediaManager.styles';
import MediaItem from './MediaItem/MediaItem';
const dummyThumbnail = 'https://via.placeholder.com/150';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { useResponsive } from '@app/hooks/useResponsive';
export type MediaFile = {
  id: string;
  path: string;
  name: string;
  size: number;
  type: string;
  createdAt: Date;
  thumbnail: string;
};
const MediaManager: React.FC = () => {
  const { isTablet } = useResponsive();
  const [selectedFiles, setSelectedFiles] = useState<MediaFile[]>([]);
  const [files, setFiles] = useState<MediaFile[]>(dummyItems);

  const handleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
      return;
    }
    setSelectedFiles(files);
  };

  const isSelected = (file: MediaFile) => {
    return selectedFiles.some((selectedFile) => selectedFile.id === file.id);
  };

  return (
    <S.MediaManagerContainer>
      <BaseRow>
        <BaseCol span={isTablet ? 10 : 24}>
          <S.BreadcrumbWrapper isTablet={isTablet}>
            <S.Breadcrumb>/ Test</S.Breadcrumb>
          </S.BreadcrumbWrapper>
        </BaseCol>
        <BaseCol span={14}>
          <BaseRow>
            <S.ButtonsContainer>
              <S.ToolBarButton>{`Select (${selectedFiles.length})`}</S.ToolBarButton>
              <S.ToolBarButton onClick={handleSelectAll}>Select All</S.ToolBarButton>
            </S.ButtonsContainer>
          </BaseRow>
        </BaseCol>
      </BaseRow>
      <S.MediaItemsContainer>
        <BaseRow gutter={[32, 24]}>
          {dummyItems.map((item) => (
            <BaseCol span={isTablet ? 4 : 6}>
              <MediaItem file={item} selected={isSelected(item)} />
            </BaseCol>
          ))}
        </BaseRow>
      </S.MediaItemsContainer>
    </S.MediaManagerContainer>
  );
};

export default MediaManager;
const dummyItems: MediaFile[] = [
  {
    id: '1',
    path: '/media/image1.jpg',
    name: 'image1.jpg',
    size: 1024,
    type: 'image/jpeg',
    createdAt: new Date('2023-01-01'),
    thumbnail: dummyThumbnail,
  },
  {
    id: '2',
    path: '/media/image2.jpg',
    name: 'image2.jpg',
    size: 2048,
    type: 'image/jpeg',
    createdAt: new Date('2023-02-01'),
    thumbnail: dummyThumbnail,
  },
  {
    id: '3',
    path: '/media/video1.mp4',
    name: 'video1.mp4',
    size: 5120,
    type: 'video/mp4',
    createdAt: new Date('2023-03-01'),
    thumbnail: dummyThumbnail,
  },
  {
    id: '4',
    path: '/media/audio1.mp3',
    name: 'audio1.mp3',
    size: 3072,
    type: 'audio/mpeg',
    createdAt: new Date('2023-04-01'),
    thumbnail: dummyThumbnail,
  },
  {
    id: '5',
    path: '/media/document1.pdf',
    name: 'document1.pdf',
    size: 10240,
    type: 'application/pdf',
    createdAt: new Date('2023-05-01'),
    thumbnail: dummyThumbnail,
  },
  {
    id: '6',
    path: '/media/document2.pdf',
    name: 'document2.pdf',
    size: 10240,
    type: 'application/pdf',
    createdAt: new Date('2023-05-01'),
    thumbnail: dummyThumbnail,
  },
];
