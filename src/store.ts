import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import counterReducer from './features/counter/counterSlice';
import authReducer from './features/auth/authSlice';
import userReducer from './features/user/userSlice';
import cityReducer from './features/city/citySlice';
import districtReducer from './features/district/districtSlice';
import wardReducer from './features/ward/wardSlice';
import photoReducer from './features/photo/photoSlice';
import streetReducer from './features/street/streetSlice';
import stationReducer from './features/station/stationSlice';
import employeeReducer from './features/employee/employeeSlice';
import routeReducer from './features/route/routeSlice';

export function makeStore() {
  return configureStore({
    reducer: {
      counter: counterReducer,
      auth: authReducer,
      user: userReducer,
      city: cityReducer,
      district: districtReducer,
      ward: wardReducer,
      photo: photoReducer,
      street: streetReducer,
      station: stationReducer,
      employee: employeeReducer,
      route: routeReducer,
    },
  });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export default store;
