import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RefreshButton from '@components/RefreshButton';

describe('RefreshButton', () => {
  it('renders with default text', () => {
    const mockOnClick = vi.fn();
    render(<RefreshButton onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('refresh-button');
    expect(button).toHaveTextContent('Refetch');
  });

  it('renders with custom children', () => {
    const mockOnClick = vi.fn();
    render(<RefreshButton onClick={mockOnClick}>Retry</RefreshButton>);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Retry');
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = vi.fn();
    render(<RefreshButton onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop is true', () => {
    const mockOnClick = vi.fn();
    render(<RefreshButton onClick={mockOnClick} disabled={true} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    const mockOnClick = vi.fn();
    render(<RefreshButton onClick={mockOnClick} className="custom-class" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('refresh-button', 'custom-class');
  });
});
