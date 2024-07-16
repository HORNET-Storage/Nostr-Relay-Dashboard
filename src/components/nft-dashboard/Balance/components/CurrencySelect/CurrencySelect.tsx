import React, { useState } from 'react';
import { CurrencyTypeEnum } from '@app/interfaces/interfaces';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
interface CurrencySelectProps {
  currencies: CurrencyTypeEnum[];
}

const CurrencySelect: React.FC<CurrencySelectProps> = ({ currencies }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyTypeEnum>('USD' as CurrencyTypeEnum);
  const handleChange = (value: CurrencyTypeEnum) => {
    setSelectedCurrency(value);
  };

  return (
    <BaseSelect value={selectedCurrency} onChange={(value) => handleChange(value as CurrencyTypeEnum)}>
      {currencies.map((currency) => (
        <Option key={currency} value={currency}>
          {currency}
        </Option>
      ))}
    </BaseSelect>
  );
};

export default CurrencySelect;
