import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ReactNode } from 'react';
import { useTheme } from '@hooks/useTheme';
import type { ThemeContextType } from '@types';
import { ThemeContext } from 'contexts';

const createWrapper = (contextValue: ThemeContextType | null) => {
  const TestWrapper = ({ children }: { children: ReactNode }) => (
    <ThemeContext.Provider value={contextValue as ThemeContextType}>
      {children}
    </ThemeContext.Provider>
  );
  TestWrapper.displayName = 'TestWrapper';
  return TestWrapper;
};

describe('useTheme', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when used within ThemeProvider', () => {
    it('should return theme context value for light theme', () => {
      const mockSetTheme = vi.fn();
      const mockContextValue: ThemeContextType = {
        theme: 'light',
        setTheme: mockSetTheme,
      };

      const wrapper = createWrapper(mockContextValue);
      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.theme).toBe('light');
      expect(result.current.setTheme).toBe(mockSetTheme);
    });

    it('should return theme context value for dark theme', () => {
      const mockSetTheme = vi.fn();
      const mockContextValue: ThemeContextType = {
        theme: 'dark',
        setTheme: mockSetTheme,
      };

      const wrapper = createWrapper(mockContextValue);
      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.theme).toBe('dark');
      expect(result.current.setTheme).toBe(mockSetTheme);
    });

    it('should call setTheme function from context', () => {
      const mockSetTheme = vi.fn();
      const mockContextValue: ThemeContextType = {
        theme: 'light',
        setTheme: mockSetTheme,
      };

      const wrapper = createWrapper(mockContextValue);
      const { result } = renderHook(() => useTheme(), { wrapper });

      result.current.setTheme('dark');

      expect(mockSetTheme).toHaveBeenCalledWith('dark');
      expect(mockSetTheme).toHaveBeenCalledTimes(1);
    });
  });

  describe('when used outside ThemeProvider', () => {
    it('should throw error', () => {
      const wrapper = createWrapper(null);

      expect(() => {
        renderHook(() => useTheme(), { wrapper });
      }).toThrow('useTheme must be used within a ThemeProvider');
    });
  });
});
