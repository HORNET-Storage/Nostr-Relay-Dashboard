import React from 'react';
import { truncateString } from '@app/utils/utils';
import * as S from './ResultScreen.styles';
import { useResponsive } from '@app/hooks/useResponsive';
interface ResultScreenProps {
  isSuccess: boolean;
  amount: number;
  receiver: string;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ isSuccess, amount, receiver }) => {
  const { isTablet } = useResponsive();
  return (
    <S.ResultScreenWrapper>
      {isSuccess ? (
        <>
          <S.ResultTextPass>Success! </S.ResultTextPass>
          <S.ResultMessage>
            {' '}
            You have successfully sent <br /> {amount} Sats <br /> to <br />
            {truncateString(receiver, isTablet ? 25 : 10)}
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
