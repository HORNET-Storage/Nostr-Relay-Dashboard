import React from 'react';
import { truncateString } from '@app/utils/utils';
import * as S from './ResultScreen.styles';
import { useResponsive } from '@app/hooks/useResponsive';
import ClipboardCopy from '@app/components/common/CopyToClipboard/CopyToClipboard';
interface ResultScreenProps {
  isSuccess: boolean;
  amount: number;
  receiver: string;
  txid: string; // New field to display the transaction ID
  message?: string; // Optional message from the transaction response
}

const ResultScreen: React.FC<ResultScreenProps> = ({ isSuccess, amount, receiver, txid, message }) => {
  const { isTablet } = useResponsive();
  return (
    <S.ResultScreenWrapper>
      {isSuccess ? (
        <>
          <S.ResultTextPass>Success!</S.ResultTextPass>
          <S.ResultMessage>
            You have successfully sent <br /> {amount} Sats <br /> to <br />{' '}
            <span>
              {truncateString(receiver, isTablet ? 45 : 10)} <ClipboardCopy textToCopy={receiver} />
            </span>
            <br />{' '}
            <span>
              Transaction ID: <br /> {truncateString(txid, isTablet ? 40 : 10)} <ClipboardCopy textToCopy={txid} />
            </span>
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
