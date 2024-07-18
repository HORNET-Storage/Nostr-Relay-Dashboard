import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { CurrencyTypeEnum } from '@app/interfaces/interfaces';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { setCurrency } from '@app/store/slices/currencySlice';
interface CurrencySelectProps {
  currencies: CurrencyTypeEnum[];
}

const CurrencySelect: React.FC<CurrencySelectProps> = ({ currencies }) => {
  const currency = useAppSelector((state) => state.currency.currency);
  const dispatch = useAppDispatch();

  const handleChange = (value: CurrencyTypeEnum) => {
    dispatch(setCurrency(value));
  };

  return (
    <BaseSelect value={currency} onChange={(value) => handleChange(value as CurrencyTypeEnum)}>
      {currencies.map((currency) => (
        <Option key={currency} value={currency}>
          {currency}
        </Option>
      ))}
    </BaseSelect>
  );
};

export default CurrencySelect;
