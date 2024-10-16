import React, { useState } from 'react';
import UnconfirmedTxModal from '../Modal/UnconfirmedTxModal';
import { useAppSelector } from '@app/hooks/reduxHooks';
import * as S from '../../../Balance/components/TopUpBalanceButton/TopUpBalanceButton.styles';
interface ButtonTriggerProps {
amount: number;
}
const ButtonTrigger: React.FC <ButtonTriggerProps> = ({amount}) => {
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
        Unconfirmed Transactions
      </S.TopUpButton>
      <UnconfirmedTxModal isOpen={isModalOpen} onOpenChange={handleModalClose} />
    </>
  );
};

export default ButtonTrigger;
