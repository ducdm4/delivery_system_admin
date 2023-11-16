import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState, AppThunk } from '../../store';
import { login, verifyUser, getSelfProfile } from './authAPI';
import { KeyValue, LoginData } from '../../common/config/interfaces';

export interface AuthState {
  user: KeyValue;
  tokens: object;
  status: 'idle' | 'loading' | 'failed';
  userDetail: {
    email: string;
    firstName: string;
    lastName: string;
    dob: string;
    gender: boolean;
    phone: string;
    profileImage: string;
    profilePicture: KeyValue;
    address: KeyValue;
  };
}

const initialState: AuthState = {
  user: {},
  tokens: {},
  status: 'idle',
  userDetail: {
    email: '',
    firstName: '',
    lastName: '',
    dob: '',
    gender: true,
    phone: '',
    profilePicture: {},
    profileImage: '',
    address: {},
  },
};

export const userLogin = createAsyncThunk(
  'auth/login',
  async (loginInfo: LoginData) => {
    const response = await login(loginInfo);
    return response;
  },
);

export const verifyUserLogin = createAsyncThunk('auth/verify', async () => {
  const response = await verifyUser();
  return response;
});

export const getLoggedInProfile = createAsyncThunk(
  'auth/selfProfile',
  async () => {
    return await getSelfProfile();
  },
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = {};
      localStorage.removeItem(
        process.env.NEXT_PUBLIC_API_KEY || 'DSAccessToken',
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.status = 'idle';
        const response = action.payload;
        if (response.isSuccess) {
          state.user = response.data['user'];
          state.tokens = response.data['tokens'];
          const { accessToken } = state.tokens as {
            accessToken: string;
          };
          if (process.env.NEXT_PUBLIC_API_KEY) {
            localStorage.setItem(process.env.NEXT_PUBLIC_API_KEY, accessToken);
          }
        }
      });

    builder
      .addCase(verifyUserLogin.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(verifyUserLogin.fulfilled, (state, action) => {
        state.status = 'idle';
        const response = action.payload;
        if (response.isSuccess) {
          state.user = response.data;
        }
      });

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
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

export const userLoggedIn = (state: AppState) => state.auth.user;
export const userLoading = (state: AppState) => state.auth.status;
