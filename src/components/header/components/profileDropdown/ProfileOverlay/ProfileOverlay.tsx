import React from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './ProfileOverlay.styles';

export const ProfileOverlay: React.FC = ({ ...props }) => {
  const { t } = useTranslation();

  return <div {...props}></div>;
};
