import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SearchBar from './SearchBar';

describe('SearchBar component', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    mockOnSearch.mockReset();
  });

  it('renders input and search button', () => {
    render(<SearchBar searchValue="" onSearch={mockOnSearch} />);

    expect(
      screen.getByPlaceholderText('Write the request...')
    ).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('calls onSearch with input value when button is clicked', () => {
    render(<SearchBar searchValue="" onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Write the request...');
    fireEvent.change(input, { target: { value: 'squirtle' } });
    fireEvent.click(screen.getByText('Search'));

    expect(mockOnSearch).toHaveBeenCalledWith('squirtle');
  });
});
