import React from 'react';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { truncateString } from '@app/utils/utils';
import * as S from './ResultScreen.styles';

interface ResultScreenProps {
  isSuccess: boolean;
  amount: number;
  receiver: string;
  txid: string;  // New field to display the transaction ID
  message?: string;  // Optional message from the transaction response
}

const ResultScreen: React.FC<ResultScreenProps> = ({ isSuccess, amount, receiver, txid, message }) => {
  return (
    <S.ResultScreenWrapper>
      {isSuccess ? (
        <>
          <S.ResultTextPass>Success!</S.ResultTextPass>
          <S.ResultMessage>
            You have successfully sent <br /> {amount} Sats <br /> to <br /> {truncateString(receiver, 10)} 
            <br />
            Transaction ID: <br /> {truncateString(txid, 15)}
          </S.ResultMessage>
        </>
      ) : (
        <>
          <S.ResultTextFail>Failed</S.ResultTextFail>
          <S.ResultMessage>
            This transaction was unable to send. <br />
            {message && <span>Error: {message}</span>}
          </S.ResultMessage>
        </>
      )}
    </S.ResultScreenWrapper>
  );
};

export default ResultScreen;

