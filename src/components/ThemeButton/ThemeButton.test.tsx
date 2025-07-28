import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeContext } from 'contexts';
import ThemeButton from './ThemeButton';

const mockSetTheme = vi.fn();

const renderWithThemeContext = (theme: string) => {
  return render(
    <ThemeContext.Provider value={{ theme, setTheme: mockSetTheme }}>
      <ThemeButton />
    </ThemeContext.Provider>
  );
};

describe('ThemeButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders ThemeButton with correct class for light theme', () => {
    renderWithThemeContext('light');

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('theme-button', 'theme-light');
  });

  it('renders ThemeButton with correct class for dark theme', () => {
    renderWithThemeContext('dark');

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('theme-button', 'theme-dark');
  });

  it('calls setTheme with "dark" when current theme is "light" and button is clicked', () => {
    renderWithThemeContext('light');

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
  });

  it('calls setTheme with "light" when current theme is "dark" and button is clicked', () => {
    renderWithThemeContext('dark');

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith('light');
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
  });

  it('toggles theme correctly on multiple clicks', () => {
    const { rerender } = render(
      <ThemeContext.Provider value={{ theme: 'light', setTheme: mockSetTheme }}>
        <ThemeButton />
      </ThemeContext.Provider>
    );

    const button = screen.getByRole('button');

    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');

    mockSetTheme.mockClear();

    rerender(
      <ThemeContext.Provider value={{ theme: 'dark', setTheme: mockSetTheme }}>
        <ThemeButton />
      </ThemeContext.Provider>
    );

    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('has correct CSS classes applied', () => {
    renderWithThemeContext('light');

    const button = screen.getByRole('button');
    expect(button).toHaveClass('theme-button');
    expect(button).toHaveClass('theme-light');
  });
});
