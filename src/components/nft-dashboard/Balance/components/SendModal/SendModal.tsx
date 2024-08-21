import React, { useState } from 'react';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseSpin } from '@app/components/common/BaseSpin/BaseSpin';
import SendForm from '../SendForm/SendForm';
import * as S from './SendModal.styles';
import ResultScreen from '../SendForm/components/ResultScreen';
interface SendModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}
interface SuccessScreenProps {
  isSuccess: boolean;
  amount: number;
  address: string;
}
const SendModal: React.FC<SendModalProps> = ({ isOpen, onOpenChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [successScreenState, setSuccessScreenState] = useState<SuccessScreenProps | null>(null);

  const onFinish = (status: boolean, address: string, amount: number) => {
    setSuccessScreenState({ isSuccess: status, address, amount });
    setIsFinished(true);
  };

  const handleFinish = () => {
    setSuccessScreenState(null);
    setIsFinished(false);
    onOpenChange();
  };
  return (
    <S.SendModal size="large" width={600} open={isOpen} onCancel={handleFinish} footer={null} destroyOnClose>
      <BaseSpin spinning={isLoading}>
        {isFinished && successScreenState ? (
          <ResultScreen
            isSuccess={successScreenState?.isSuccess}
            amount={successScreenState.amount}
            receiver={successScreenState.address}
          ></ResultScreen>
        ) : (
          <SendForm onSend={onFinish} />
        )}
      </BaseSpin>
    </S.SendModal>
  );
};

export default SendModal;
