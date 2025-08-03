import { createContext } from 'react';
import type { ThemeContextType } from '@types';
import { THEME_DAY } from '@constants';

export const ThemeContext = createContext<ThemeContextType>({
  theme: THEME_DAY,
  setTheme: () => {},
});
