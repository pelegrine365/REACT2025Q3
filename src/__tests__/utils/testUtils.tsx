import React from 'react';
import { Provider } from 'react-redux';
import { vi } from 'vitest';
import { ThemeContext } from 'contexts';
import type { Theme } from '@types';
import { createTestStore } from './testStoreUtils';

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
