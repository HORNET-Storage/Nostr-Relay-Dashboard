import React, { useState } from 'react';
import * as S from '../TopUpBalanceButton/TopUpBalanceButton.styles';
import SendModal from '../SendModal/SendModal';
import { useAppSelector } from '@app/hooks/reduxHooks';

const SendButton: React.FC = () => {
  const { theme } = useAppSelector((state) => state.theme);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleButtonClick = () => {
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <S.TopUpButton type={theme === 'dark' ? 'ghost' : 'primary'} block onClick={handleButtonClick}>
        {'Send'}
      </S.TopUpButton>
      <SendModal isOpen={isModalOpen} onOpenChange={handleModalClose} />
    </>
  );
};

export default SendButton;
