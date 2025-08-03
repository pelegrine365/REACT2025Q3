import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from './index';

describe('Header', () => {
  it('renders the title text', () => {
    render(<Header title="Test Title" />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Test Title' })
    ).toBeInTheDocument();
  });

  it('has correct CSS classes for container and title', () => {
    render(<Header title="Another Title" />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('header__title');
    expect(heading.parentElement).toHaveClass('header');
  });
});
