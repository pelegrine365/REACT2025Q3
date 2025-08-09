import { configureStore } from '@reduxjs/toolkit';
import selectedItemsReducer from 'store/selectedItemsSlice';

export const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
    },
    preloadedState,
  });
};
