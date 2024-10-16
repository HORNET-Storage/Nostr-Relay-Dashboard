import React, { useState } from 'react';
import * as S from './UnconfirmedTransaction.styles';
import { useResponsive } from '@app/hooks/useResponsive';
import { truncateString } from '@app/utils/utils';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import ClipboardCopy from '@app/components/common/CopyToClipboard/CopyToClipboard';
interface UnconfirmedTransactionProps {
  tx_id: string;
  date_created: string;
  amount: string;
  feeAmount?: string;
}

const UnconfirmedTransaction: React.FC<UnconfirmedTransactionProps> = ({ tx_id, date_created, amount, feeAmount }) => {
  const { isDesktop, isTablet } = useResponsive();
  const copied = () => {
    message.success('Copied to clipboard');
  };
  const onCopy = () => {
    //display Copied to clipboard
    copied();
  };
  return (
    <S.TransactionWrapper>
      <S.IDWrapper $isMobile={!isDesktop}>
        <S.Value>
          <S.TxIDWrapper> {tx_id} </S.TxIDWrapper>
          <S.CopyWrapper $isDesktop={isDesktop}>
            <ClipboardCopy textToCopy={tx_id} />
          </S.CopyWrapper>
        </S.Value>

        <S.Label>Transaction ID</S.Label>
      </S.IDWrapper>
      <S.DataWrapper>
        <S.Value>{date_created}</S.Value>
        <S.Label>Date Created</S.Label>
      </S.DataWrapper>
      <S.DataWrapper>
        <S.Value>{amount}</S.Value>
        <S.Label>Amount</S.Label>
      </S.DataWrapper>
    </S.TransactionWrapper>
  );
};

export default UnconfirmedTransaction;
