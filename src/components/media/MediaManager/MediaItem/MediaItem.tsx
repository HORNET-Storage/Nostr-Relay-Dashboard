import React from 'react';
import { MediaFile } from '../MediaManager';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import * as S from './MediaItem.styles';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { MoreOutlined } from '@ant-design/icons';
import { MenuProps } from 'antd';
import { BaseDropdown } from '@app/components/common/BaseDropdown/Dropdown';
interface MediaItemProps {
  file: MediaFile;
}
const MediaItem: React.FC<MediaItemProps> = ({ file }) => {

  const handleDelete = () => {
    // todo: delete file
  
  }
  const handleDownload = () => {  
  //todo: download file
  }
  
  const menuItems: MenuProps['items']  = [
    {
      key: '1',
      label: 'Donwload',
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
      <S.MediaThumbnail src={file.thumbnail} alt={file.name} />
      <BaseRow>
        <BaseCol span={20}>
          <S.MediaInfoContainer>
            <S.FileName>{file.name}</S.FileName>
            <S.SizeData>{file.size} bytes</S.SizeData>
          </S.MediaInfoContainer>
        </BaseCol>
        <BaseCol span={4}>
          <S.ButtonWrapper>
            <BaseDropdown menu={{ items: menuItems }} placement='bottomRight'>
              <BaseButton type="text" icon={<MoreOutlined />} size="large" />
            </BaseDropdown>
          </S.ButtonWrapper>
        </BaseCol>
      </BaseRow>
    </S.MediaItemContainer>
  );
};

export default MediaItem;
