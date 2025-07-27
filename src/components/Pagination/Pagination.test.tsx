import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';

describe('Pagination', () => {
  const mockOnPageChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders pagination with current page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={false}
      />
    );

    expect(screen.getByText('1')).toHaveClass('active');
  });

  it('calls onPageChange when page button is clicked', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={true}
      />
    );

    fireEvent.click(screen.getByText('1'));
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it('shows correct visible pages around current page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={20}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={true}
      />
    );

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });
});
