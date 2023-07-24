import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  addNewRoute,
  getAllRoutesFilter,
  getRouteById,
  editRouteById,
  deleteRouteById,
} from './routeAPI';
import { KeyValue } from '../../common/config/interfaces';
import { AppState } from '../../store';

export interface RouteState {
  status: 'idle' | 'loading' | 'failed';
}

const initialState: RouteState = {
  status: 'idle',
};

export const createNewRoute = createAsyncThunk(
  'route/add',
  async (data: KeyValue) => {
    return await addNewRoute(data);
  },
);

export const getRouteInfo = createAsyncThunk(
  'route/getInfo',
  async (data: KeyValue) => {
    return await getRouteById(data);
  },
);

export const editRouteInfo = createAsyncThunk(
  'route/edit',
  async (data: KeyValue) => {
    return await editRouteById(data);
  },
);

export const getRouteListFilter = createAsyncThunk(
  'route/getListFilter',
  async (data: KeyValue) => {
    return await getAllRoutesFilter(data);
  },
);

export const deleteRouteThunk = createAsyncThunk(
  'route/delete',
  async (data: KeyValue) => {
    return await deleteRouteById(data);
  },
);

export const RouteSlice = createSlice({
  name: 'route',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createNewRoute.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createNewRoute.fulfilled, (state, action) => {
        state.status = 'idle';
      });

    builder
      .addCase(getRouteInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getRouteInfo.fulfilled, (state, action) => {
        state.status = 'idle';
      });

    builder
      .addCase(getRouteListFilter.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getRouteListFilter.fulfilled, (state, action) => {
        state.status = 'idle';
      });
  },
});

export const {} = RouteSlice.actions;

export default RouteSlice.reducer;

export const routeLoading = (state: AppState) => state.route.status;
