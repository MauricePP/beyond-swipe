import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import profileReducer from './slices/profileSlice';
import matchesReducer from './slices/matchesSlice';
import datesReducer from './slices/datesSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    matches: matchesReducer,
    dates: datesReducer,
    user: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
