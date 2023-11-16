import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { KeyValue } from '../../common/config/interfaces';
import { AppState } from '../../store';
import { getNewOrderByStatusAPI } from './orderAPI';

export interface OrderState {
  status: 'idle' | 'loading' | 'failed';
}

const initialState: OrderState = {
  status: 'idle',
};


export const getOrderByStatus = createAsyncThunk(
  'order/getOrderByStatus',
  async (data: KeyValue) => {
    return await getNewOrderByStatusAPI(data);
  },
);

export const OrderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {}})


export const {} = OrderSlice.actions;

export default OrderSlice.reducer;

export const orderLoading = (state: AppState) => state.order.status;