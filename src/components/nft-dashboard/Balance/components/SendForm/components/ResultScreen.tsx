import React from 'react';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { truncateString } from '@app/utils/utils';
import * as S from './ResultScreen.styles';
interface ResultScreenProps {
  isSuccess: boolean;
  amount: number;
  receiver: string;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ isSuccess, amount, receiver }) => {
  return (
    <S.ResultScreenWrapper>
      {isSuccess ? (
        <>
          <S.ResultTextPass>Success! </S.ResultTextPass>
          <S.ResultMessage>
            {' '}
            You have successfully sent <br/> {amount} Sats <br/>   to  <br/>  {truncateString(receiver, 10)} 
          </S.ResultMessage>
        </>
      ) : (
        <>
          <S.ResultTextFail>Failed </S.ResultTextFail>
          <S.ResultMessage> This transaction was unable to send. </S.ResultMessage>
        </>
      )}
    </S.ResultScreenWrapper>
  );
};

export default ResultScreen;
