import React, { useCallback, useMemo } from 'react';
import { BaseRadio } from '@app/components/common/BaseRadio/BaseRadio';
import { EmailItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/EmailItem/EmailItem';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { TwoFactorAuthOption } from '@app/interfaces/interfaces';
import { TwoFactorAuthOptionState } from '../TwoFactorAuth';
import * as S from './TwoFactorOptions.styles';

interface TwoFactorOptionsProps {
  selectedOption: TwoFactorAuthOptionState;
  setSelectedOption: (state: TwoFactorAuthOptionState) => void;
}

export const TwoFactorOptions: React.FC<TwoFactorOptionsProps> = ({ selectedOption, setSelectedOption }) => {
  const user = useAppSelector((state) => state.user.user);

  const { isEmailActive } = useMemo(
    () => ({
      isEmailActive: selectedOption === 'email',
    }),
    [selectedOption],
  );

  const onClickInput = useCallback(
    (mode: TwoFactorAuthOption) => () => {
      setSelectedOption(mode);
    },
    [setSelectedOption],
  );

  return (
    <>
      <BaseRadio.Group
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value as TwoFactorAuthOptionState)}
      >
        <S.RadioBtn value="email" $isActive={isEmailActive}>
          <EmailItem required={isEmailActive} onClick={onClickInput('email')} />
        </S.RadioBtn>
      </BaseRadio.Group>
    </>
  );
};
