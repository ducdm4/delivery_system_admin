import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { AppState } from '../../store';
import {
  getAllEmployeeFilter,
  getEmployeeById,
  deleteEmployeeById,
  updateEmployeeInfoAPI,
  patchEmployeeById,
  createNewEmployeeAPI,
} from './employeeAPI';
import { KeyValue } from '../../common/config/interfaces';

export interface EmployeeState {
  status: 'idle' | 'loading' | 'failed';
}

const initialState: EmployeeState = {
  status: 'idle',
};

export const createNewEmployee = createAsyncThunk(
  'employee/create',
  async (data: KeyValue) => {
    return await createNewEmployeeAPI(data);
  },
);

export const updateEmployeeInfo = createAsyncThunk(
  'employee/update',
  async (data: KeyValue) => {
    return await updateEmployeeInfoAPI(data);
  },
);

export const getEmployeeInfo = createAsyncThunk(
  'employee/getInfo',
  async (data: KeyValue) => {
    return await getEmployeeById(data);
  },
);

export const getListEmployeeFilter = createAsyncThunk(
  'employee/getList',
  async (data: KeyValue) => {
    return await getAllEmployeeFilter(data);
  },
);

export const deleteEmployeeThunk = createAsyncThunk(
  'employee/delete',
  async (data: KeyValue) => {
    return await deleteEmployeeById(data);
  },
);

export const patchEmployeeInfo = createAsyncThunk(
  'employee/patch',
  async (data: KeyValue) => {
    return await patchEmployeeById(data);
  },
);

export const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createNewEmployee.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createNewEmployee.fulfilled, (state, action) => {
        state.status = 'idle';
      });

    builder
      .addCase(getEmployeeInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getEmployeeInfo.fulfilled, (state, action) => {
        state.status = 'idle';
      });

    builder
      .addCase(updateEmployeeInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateEmployeeInfo.fulfilled, (state, action) => {
        state.status = 'idle';
      });

    builder
      .addCase(getListEmployeeFilter.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getListEmployeeFilter.fulfilled, (state, action) => {
        state.status = 'idle';
      });

    builder
      .addCase(deleteEmployeeThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteEmployeeThunk.fulfilled, (state, action) => {
        state.status = 'idle';
      });

    builder
      .addCase(patchEmployeeInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(patchEmployeeInfo.fulfilled, (state, action) => {
        state.status = 'idle';
      });
  },
});

export const {} = employeeSlice.actions;

export const employeeLoading = (state: AppState) => state.employee.status;

export default employeeSlice.reducer;
