import { ThemeContext } from 'contexts';
import { useContext } from 'react';
import type { ThemeContextType } from '@types';

export const useTheme = (): ThemeContextType => {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return theme;
};
