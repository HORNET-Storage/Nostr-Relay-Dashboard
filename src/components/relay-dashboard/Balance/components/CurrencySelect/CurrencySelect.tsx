import React, {useState, useEffect} from 'react';
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
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyTypeEnum>(currency);  
  const handleChange = (value: CurrencyTypeEnum) => {
    dispatch(setCurrency(value));
  };

  useEffect(() => {
    if(!currency || currency === CurrencyTypeEnum.SATS) return
    setCurrentCurrency(currency);
  }, [currency]); 
  
  const options = currencies.map((currency) => ({
    value: currency,
    label: <span style={{fontWeight:"500", fontSize:".95rem", lineHeight:"1.5715", fontFamily: " Montserrat, sans-serif"}}>{currency}</span>,
  }));

  

  return (
    <BaseSelect
      style={{ marginLeft: '.6rem'}}
      size="small"
      value={currentCurrency}
      options={options}
      onChange={(value) => handleChange(value as CurrencyTypeEnum)}
    >
      
    </BaseSelect>
  );
};

export default CurrencySelect;
