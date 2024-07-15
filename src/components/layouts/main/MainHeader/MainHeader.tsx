import { WithChildrenProps } from '@app/types/generalTypes';
import React from 'react';
import * as S from './MainHeader.styles';

interface MainHeaderProps extends WithChildrenProps {
  isTwoColumnsLayout: boolean;
  isSiderOpened: boolean;
}

export const MainHeader: React.FC<MainHeaderProps> = ({ isTwoColumnsLayout, isSiderOpened, children }) => {
  return (
    <S.Header $isSiderOpened={isSiderOpened} $isTwoColumnsLayoutHeader={isTwoColumnsLayout}>
      {children}
    </S.Header>
  );
};
