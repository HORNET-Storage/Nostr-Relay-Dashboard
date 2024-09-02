import React from 'react';
import * as S from './UnconfirmedTxModal.styles';
import UnconfirmedTransactions from '../../UnconfirmedTransactions';
interface UnconfirmedTxModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}
const transactions:any = [

]
const UnconfirmedTxModal: React.FC<UnconfirmedTxModalProps> = ({ isOpen, onOpenChange }) => {
  return (
    <S.Modal open={isOpen} centered={true} onCancel = {onOpenChange} footer={null} destroyOnClose>
      <UnconfirmedTransactions transactions={transactions}></UnconfirmedTransactions>
    </S.Modal>
  );
};

export default UnconfirmedTxModal;
