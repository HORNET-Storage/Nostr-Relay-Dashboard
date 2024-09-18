import React, { useState } from 'react';
import { CopyOutlined } from '@ant-design/icons';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, message } from 'antd';
interface CopyToClipboardProps {
  textToCopy: string;
}

const ClipboardCopy: React.FC<CopyToClipboardProps> = ({ textToCopy }) => {
  const copied = () => {
    message.success('Copied to clipboard');
  };
  const onCopy = () => {
    //display Copied to clipboard
    copied();
  };
  return (
    <CopyToClipboard text={textToCopy}>
      <Button onClick={onCopy} icon={<CopyOutlined />} size="small" />
    </CopyToClipboard>
  );
};

export default ClipboardCopy;
