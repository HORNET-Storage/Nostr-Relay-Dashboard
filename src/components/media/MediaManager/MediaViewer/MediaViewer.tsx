import React from 'react';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { MediaFile } from '../MediaManager'; // Assuming you already have this type
import * as S from './MediaViewer.styles'
type MediaViewerProps = {
  visible: boolean;
  onClose: () => void;
  file: MediaFile | null;
};

const MediaViewer: React.FC<MediaViewerProps> = ({ visible, onClose, file }) => {
  if (!file) return null;

  return (
    <S.Modal open={visible} onCancel={onClose} footer={null} width={800}>
      <S.MediaWrapper>
        {file.type.startsWith('image') && <img src={file.thumbnail} alt={file.name} style={{ width: '100%' }} />}
        {file.type.startsWith('video') && <video controls src={file.path} style={{ width: '100%' }} />}
        {file.type.startsWith('audio') && <audio controls src={file.path} style={{ width: '100%' }} />}
        {file.type.startsWith('application') && <S.NotSupported>File type not supported</S.NotSupported>}
      </S.MediaWrapper>
    </S.Modal>
  );
};

export default MediaViewer;
