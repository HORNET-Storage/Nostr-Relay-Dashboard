 import {createSlice, PayloadAction} from '@reduxjs/toolkit';
 import { CurrencyTypeEnum } from '@app/interfaces/interfaces';

 interface CurrencyState {
    currency: CurrencyTypeEnum;
    rate: number | null;
    date: number | null;
     }

const initialState: CurrencyState = {
    currency: CurrencyTypeEnum.USD,
    rate: null,
    date: null,
}

const currencySlice = createSlice({
    name: 'currency',
    initialState,
    reducers: {
        setCurrency: (state, action: PayloadAction<CurrencyState>) => {
            state.currency = action.payload.currency;
            state.rate = action.payload.rate;
            state.date = action.payload.date;
        },
    },
});
export const { setCurrency } = currencySlice.actions;   
export default currencySlice.reducer;