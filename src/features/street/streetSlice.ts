import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  addNewStreet,
  getAllStreetsFilter,
  getStreetById,
  editStreetById,
  deleteStreetById,
  getStreetNotInRouteAPI,
} from './streetAPI';
import { KeyValue } from '../../common/config/interfaces';
import { AppState } from '../../store';

export interface StreetState {
  status: 'idle' | 'loading' | 'failed';
}

const initialState: StreetState = {
  status: 'idle',
};

export const createNewStreet = createAsyncThunk(
  'street/add',
  async (data: KeyValue) => {
    return await addNewStreet(data);
  },
);

export const getStreetInfo = createAsyncThunk(
  'street/getInfo',
  async (data: KeyValue) => {
    return await getStreetById(data);
  },
);

export const editStreetInfo = createAsyncThunk(
  'street/edit',
  async (data: KeyValue) => {
    return await editStreetById(data);
  },
);

export const getStreetListFilter = createAsyncThunk(
  'street/getListFilter',
  async (data: KeyValue) => {
    return await getAllStreetsFilter(data);
  },
);

export const deleteStreetThunk = createAsyncThunk(
  'street/delete',
  async (data: KeyValue) => {
    return await deleteStreetById(data);
  },
);

export const getStreetNotInRoute = createAsyncThunk(
  'street/getStreetNotInRoute',
  async (data: KeyValue) => {
    return await getStreetNotInRouteAPI(data);
  },
);

export const StreetSlice = createSlice({
  name: 'street',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createNewStreet.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createNewStreet.fulfilled, (state) => {
        state.status = 'idle';
      });

    builder
      .addCase(getStreetInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getStreetInfo.fulfilled, (state) => {
        state.status = 'idle';
      });

    builder
      .addCase(getStreetListFilter.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getStreetListFilter.fulfilled, (state) => {
        state.status = 'idle';
      });

    builder
      .addCase(getStreetNotInRoute.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getStreetNotInRoute.fulfilled, (state) => {
        state.status = 'idle';
      });
  },
});

export const {} = StreetSlice.actions;

export default StreetSlice.reducer;

export const streetLoading = (state: AppState) => state.street.status;
