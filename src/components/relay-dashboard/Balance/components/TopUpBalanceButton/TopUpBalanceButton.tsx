import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { TopUpBalanceModal } from '../TopUpBalanceModal/TopUpBalanceModal';
import * as S from './TopUpBalanceButton.styles';

export const TopUpBalanceButton: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useAppSelector((state) => state.theme);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleFinish = () => {
    console.log('Finish button clicked');
  };

  return (
    <>
      <S.TopUpButton type={theme === 'dark' ? 'ghost' : 'primary'} block onClick={handleButtonClick}>
        {t('nft.receivingAddresses')}
      </S.TopUpButton>
      <TopUpBalanceModal
        isOpen={isModalOpen}
        onOpenChange={handleModalClose}
        cards={[]}
        loading={false}
        onFinish={handleFinish}
      />
    </>
  );
};
