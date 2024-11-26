import { configureStore } from '@reduxjs/toolkit';
import transactionsReducer from './transactionsSlice';
import categoriesReducer from './categoriesSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    categories: categoriesReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;