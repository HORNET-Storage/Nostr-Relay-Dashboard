import React from 'react';
import * as S from './UnconfirmedTransactions.styles'; 
import UnconfirmedTransaction from './UnconfirmedTransaction/UnconfirmedTransaction';

import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
interface UnconfirmedTransactionsProps {
    // Define your component props here
}

const UnconfirmedTransactions: React.FC<UnconfirmedTransactionsProps> = () => {
    // Add your component logic here

    return (
       <S.ContentWrapper>
            <S.PanelHeaderText>Unconfirmed Transactions</S.PanelHeaderText>
            <S.PanelContent>
                <UnconfirmedTransaction tx_id="123456" date_created='2021-09-01' amount='0.0001' />
            <S.ButtonWrapper>
                <BaseButton>Replace</BaseButton>
            </S.ButtonWrapper>
            </S.PanelContent>
       </S.ContentWrapper>
    );
};

export default UnconfirmedTransactions;