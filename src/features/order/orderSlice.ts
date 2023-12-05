import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { KeyValue } from '../../common/config/interfaces';
import { AppState } from '../../store';
import {
  cancelOrderOperatorAPI,
  getNewOrderByStatusAPI,
  confirmOrderOperatorAPI,
  confirmOrderArrivedAPI,
} from './orderAPI';

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

export const cancelOrderOperator = createAsyncThunk(
  'order/cancelOrderOperator',
  async (data: KeyValue) => {
    return await cancelOrderOperatorAPI(data);
  },
);

export const confirmOrderOperator = createAsyncThunk(
  'order/confirmOrderOperator',
  async (data: KeyValue) => {
    return await confirmOrderOperatorAPI(data);
  },
);

export const confirmOrderArrivedAction = createAsyncThunk(
  'order/confirmOrderArrivedAction',
  async (data: KeyValue) => {
    return await confirmOrderArrivedAPI(data);
  },
);

export const OrderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrderByStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getOrderByStatus.fulfilled, (state) => {
        state.status = 'idle';
      });

    builder
      .addCase(cancelOrderOperator.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(cancelOrderOperator.fulfilled, (state) => {
        state.status = 'idle';
      });

    builder
      .addCase(confirmOrderOperator.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(confirmOrderOperator.fulfilled, (state) => {
        state.status = 'idle';
      });
    builder
      .addCase(confirmOrderArrivedAction.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(confirmOrderArrivedAction.fulfilled, (state) => {
        state.status = 'idle';
      });
  },
});

export const {} = OrderSlice.actions;

export default OrderSlice.reducer;

export const orderLoading = (state: AppState) => state.order.status;
