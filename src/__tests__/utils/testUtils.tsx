import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { vi } from 'vitest';
import selectedItemsReducer from 'store/selectedItemsSlice';
import { ThemeContext } from 'contexts';
import type { Theme } from '@types';

export const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
    },
    preloadedState,
  });
};

export const TestWrapper = ({
  children,
  store = createTestStore(),
  theme = 'light',
}: {
  children: React.ReactNode;
  store?: ReturnType<typeof createTestStore>;
  theme?: Theme;
}) => (
  <Provider store={store}>
    <ThemeContext.Provider value={{ theme, setTheme: vi.fn() }}>
      {children}
    </ThemeContext.Provider>
  </Provider>
);
