import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { CurrencyTypeEnum } from '@app/interfaces/interfaces';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { setCurrency, setRates, setCurrentPrice } from '@app/store/slices/currencySlice';
import useFiatRates from '@app/hooks/useFiatRates';
import { getBitcoinPriceByCurrency } from '@app/api/earnings.api';
useFiatRates;
interface CurrencySelectProps {
  currencies: CurrencyTypeEnum[];
}

const CurrencySelect: React.FC<CurrencySelectProps> = ({ currencies }) => {
  const currency = useAppSelector((state) => state.currency.currency);
  const dispatch = useAppDispatch();
  const { rates, isLoading, error, } = useFiatRates(currency);

  const getCurrentPrice = async () => {
    const price = await getBitcoinPriceByCurrency(currency);
    dispatch(setCurrentPrice(price));
  };
  useEffect(() => {
    dispatch(setRates);
  }, [rates]);

  const handleChange = (value: CurrencyTypeEnum) => {
    dispatch(setCurrency(value));
    
  };
  useEffect(() => {
    getCurrentPrice();
  }, [currency]);

  return (
    <BaseSelect
      style={{ marginLeft: '1rem', fontSize: '.95rem', fontWeight: '500' }}
      size="small"
      value={currency}
      onChange={(value) => handleChange(value as CurrencyTypeEnum)}
    >
      {currencies.map((currency) => (
        <Option key={currency} value={currency}>
          {currency}
        </Option>
      ))}
    </BaseSelect>
  );
};

export default CurrencySelect;
