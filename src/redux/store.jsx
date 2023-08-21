
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userSlice from './reducers';

const store = configureStore({
  reducer: userSlice

});

export default store;
