import React from 'react';
import { MediaFile } from '../MediaManager';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import * as S from './MediaItem.styles';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { MoreOutlined } from '@ant-design/icons';
import { MenuProps } from 'antd';
import { BaseDropdown } from '@app/components/common/BaseDropdown/Dropdown';
import { CheckOutlined } from '@ant-design/icons';
import MusicIcon from '@app/components/common/icons/MusicIcon';
import VideoIcon from '@app/components/common/icons/VideoIcon';
import ImageIcon from '@app/components/common/icons/ImageIcon';
interface MediaItemProps {
  file: MediaFile;
  selected: boolean;
}

const MediaItem: React.FC<MediaItemProps> = ({ file, selected}) => {

  const handleDelete = () => {
    // todo: delete file; both this and download will probably need onDeleted and onDownloaded props
  };
  const handleDownload = () => {
    //todo: download file
  };
const parseType = (fileType: string) => {
  const parsedType =  fileType.split('/')[0];
  return parsedType;
}
  
  const getMediaTypeIcon = (type: string) => {
    //TODO: this will need to be updated to handle how types are declared in the backend
    const parsedType = parseType(type);
    switch (parsedType) {
      case 'audio':
        return <MusicIcon />;
      case 'video':
        return <VideoIcon />;
      case 'image':
        return <ImageIcon />;
      default:
        return <ImageIcon />;
    }
  };
  const menuItems: MenuProps['items'] = [
    {
      key: '1',
      label: 'Download',
      onClick: handleDownload,
    },
    {
      key: '2',
      label: 'Delete',
      onClick: handleDelete,
    },
  ];
  return (
    <S.MediaItemContainer>
      <S.ThumbnailContainer>
        <S.MediaTypeIndicator>{getMediaTypeIcon(file.type)}</S.MediaTypeIndicator>
        <S.MediaThumbnail src={file.thumbnail} alt={file.name} />
        {selected && (
          <S.Overlay>
            <S.CheckmarkIcon>
              <CheckOutlined />
            </S.CheckmarkIcon>
          </S.Overlay>
        )}
      </S.ThumbnailContainer>
      <BaseRow>
        <BaseCol span={20}>
          <S.MediaInfoContainer>
            <S.FileName>{file.name}</S.FileName>
            <S.SizeData>{file.size} bytes</S.SizeData>
          </S.MediaInfoContainer>
        </BaseCol>
        <BaseCol span={4}>
          <S.ButtonWrapper>
            <BaseDropdown menu={{ items: menuItems }} placement="bottomRight">
              <BaseButton type="text" icon={<MoreOutlined />} size="large" />
            </BaseDropdown>
          </S.ButtonWrapper>
        </BaseCol>
      </BaseRow>
    </S.MediaItemContainer>
  );
};

export default MediaItem;
