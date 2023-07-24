import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  addNewStation,
  getAllStationsFilter,
  getStationById,
  editStationById,
  deleteStationById,
  getChildStationAPI,
} from './stationAPI';
import { KeyValue } from '../../common/config/interfaces';
import { AppState } from '../../store';

export interface StationState {
  status: 'idle' | 'loading' | 'failed';
}

const initialState: StationState = {
  status: 'idle',
};

export const createNewStation = createAsyncThunk(
  'station/add',
  async (data: KeyValue) => {
    return await addNewStation(data);
  },
);

export const getStationInfo = createAsyncThunk(
  'station/getInfo',
  async (data: KeyValue) => {
    return await getStationById(data);
  },
);

export const getChildStation = createAsyncThunk(
  'station/getChildStation',
  async (data: KeyValue) => {
    return await getChildStationAPI(data);
  },
);

export const editStationInfo = createAsyncThunk(
  'station/edit',
  async (data: KeyValue) => {
    return await editStationById(data);
  },
);

export const getStationListFilter = createAsyncThunk(
  'station/getListFilter',
  async (data: KeyValue) => {
    return await getAllStationsFilter(data);
  },
);

export const deleteStationThunk = createAsyncThunk(
  'station/delete',
  async (data: KeyValue) => {
    return await deleteStationById(data);
  },
);

export const StationSlice = createSlice({
  name: 'station',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createNewStation.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createNewStation.fulfilled, (state, action) => {
        state.status = 'idle';
      });

    builder
      .addCase(getStationInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getStationInfo.fulfilled, (state, action) => {
        state.status = 'idle';
      });

    builder
      .addCase(getStationListFilter.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getStationListFilter.fulfilled, (state, action) => {
        state.status = 'idle';
      });

    builder
      .addCase(getChildStation.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getChildStation.fulfilled, (state, action) => {
        state.status = 'idle';
      });
  },
});

export const {} = StationSlice.actions;

export default StationSlice.reducer;

export const stationLoading = (state: AppState) => state.station.status;
