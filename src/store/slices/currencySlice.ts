import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CurrencyTypeEnum } from '@app/interfaces/interfaces';
interface FiatRate {
  rate: number;
  date: number;
}
interface CurrencyState {
  currency: CurrencyTypeEnum;
  rates: FiatRate[];
}

const initialState: CurrencyState = {
  currency: CurrencyTypeEnum.USD,
  rates: [],
};

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<CurrencyTypeEnum>) => {
      state.currency = action.payload;
      state.rates = [];
    },
  },
});

export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;
