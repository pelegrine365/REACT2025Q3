import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import * as router from 'react-router-dom';

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom'
    );
  return {
    ...actual,
    useMatches: vi.fn(),
  };
});

vi.mock('@components/Navigation', () => ({
  default: () => <div data-testid="navigation" />,
}));
vi.mock('@components/Header', () => ({
  default: ({ title }: { title: string }) => (
    <div data-testid="header">{title}</div>
  ),
}));

vi.mock('@components/Pagination', () => ({
  default: () => <div data-testid="pagination">Pagination</div>,
}));

describe('App layout component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('always renders navigation', () => {
    Object.defineProperty(router, 'useMatches', {
      configurable: true,
      value: () => [],
    });
    render(<App />);
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
  });

  it('renders header when route handle has title', () => {
    Object.defineProperty(router, 'useMatches', {
      configurable: true,
      value: () => [{ handle: {} }, { handle: { title: 'My Page' } }],
    });
    render(<App />);
    expect(screen.getByTestId('header')).toHaveTextContent('My Page');
  });

  it('does not render header when no title in route handle', () => {
    Object.defineProperty(router, 'useMatches', {
      configurable: true,
      value: () => [{ handle: {} }],
    });
    render(<App />);
    expect(screen.queryByTestId('header')).toBeNull();
  });

  it('renders main element for content', () => {
    Object.defineProperty(router, 'useMatches', {
      configurable: true,
      value: () => [],
    });
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
