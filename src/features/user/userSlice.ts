import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { AppState } from '../../store';
import {
  getSelfProfile,
  updateSelfProfileAPI,
  updatePasswordAPI,
} from './userAPI';
import { KeyValue } from '../../common/config/interfaces';

export interface UserState {
  status: 'idle' | 'loading' | 'failed';
  userDetail: {
    email: string;
    firstName: string;
    lastName: string;
    dob: string;
    gender: boolean;
    phone: string;
    profilePicture: KeyValue;
    address: KeyValue;
  };
}

const initialState: UserState = {
  status: 'idle',
  userDetail: {
    email: '',
    firstName: '',
    lastName: '',
    dob: '',
    gender: true,
    phone: '',
    profilePicture: {},
    address: {},
  },
};

export const getLoggedInProfile = createAsyncThunk(
  'user/selfProfile',
  async () => {
    return await getSelfProfile();
  },
);

export const updateSelfProfile = createAsyncThunk(
  'user/updateSelfProfile',
  async (payload: KeyValue) => {
    return await updateSelfProfileAPI(payload);
  },
);

export const updatePassword = createAsyncThunk(
  'user/updatePassword',
  async (payload: KeyValue) => {
    return await updatePasswordAPI(payload);
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLoggedInProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getLoggedInProfile.fulfilled, (state, action) => {
        state.status = 'idle';
        const response = action.payload;
        if (response.isSuccess) {
          state.userDetail = response.data['userInfo'];
        }
      });

    builder
      .addCase(updateSelfProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateSelfProfile.fulfilled, (state) => {
        state.status = 'idle';
      });

    builder
      .addCase(updatePassword.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.status = 'idle';
      });
  },
});

export const {} = userSlice.actions;

export const userLoggedInDetail = (state: AppState) => state.user.userDetail;
export const userLoading = (state: AppState) => state.user.status;

export default userSlice.reducer;
