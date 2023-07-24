import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addNewPhoto, getPhotoById } from './photoAPI';
import { KeyValue } from '../../common/config/interfaces';
import { AppState } from '../../store';

export interface PhotoState {
  status: 'idle' | 'loading' | 'failed';
  userProfile: string;
}

const initialState: PhotoState = {
  status: 'idle',
  userProfile: '',
};

export const createNewPhoto = createAsyncThunk(
  'photo/add',
  async (data: KeyValue) => {
    return await addNewPhoto(data);
  },
);

export const getPhotoInfo = createAsyncThunk(
  'photo/getInfo',
  async (data: KeyValue) => {
    return await getPhotoById(data);
  },
);

export const getUserProfilePicture = createAsyncThunk(
  'photo/getProfile',
  async (data: KeyValue) => {
    return await getPhotoById(data);
  },
);

export const PhotoSlice = createSlice({
  name: 'photo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createNewPhoto.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createNewPhoto.fulfilled, (state, action) => {
        state.status = 'idle';
      });

    builder
      .addCase(getPhotoInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getPhotoInfo.fulfilled, (state, action) => {
        state.status = 'idle';
      });

    builder
      .addCase(getUserProfilePicture.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUserProfilePicture.fulfilled, (state, action) => {
        state.userProfile = URL.createObjectURL(action.payload.data);
        state.status = 'idle';
      });
  },
});

export const {} = PhotoSlice.actions;

export default PhotoSlice.reducer;

export const profileImageState = (state: AppState) => state.photo.userProfile;
export const photoLoading = (state: AppState) => state.photo.status;
