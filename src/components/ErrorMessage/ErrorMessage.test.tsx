import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorMessage from '../ErrorMessage';

const errorMessage = 'Pokemon not found';

describe('ErrorMessage', () => {
  it('renders the error message text', () => {
    render(<ErrorMessage message={errorMessage} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('has correct CSS class for styling', () => {
    render(<ErrorMessage message={errorMessage} />);
    const element = screen.getByText(errorMessage);
    expect(element).toHaveClass('error-message');
  });

  it('renders with empty message without crashing', () => {
    render(<ErrorMessage message="" />);
    expect(
      screen.getByText('Opppps, something went wrong!')
    ).toBeInTheDocument();
  });

  it('has alert role for accessibility', () => {
    render(<ErrorMessage message={errorMessage} />);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(errorMessage);
  });
});
