import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  createMemoryRouter,
  RouterProvider,
  type RouteObject,
} from 'react-router-dom';
import App from './App';

vi.mock('@components/Navigation', () => ({
  default: () => <div data-testid="navigation" />,
}));
vi.mock('@components/Header', () => ({
  default: ({ title }: { title: string }) => (
    <div data-testid="header">{title}</div>
  ),
}));

const renderWithRouter = (routes: RouteObject[]) => {
  const router = createMemoryRouter(routes, { initialEntries: ['/'] });
  return render(<RouterProvider router={router} />);
};

describe('App layout component', () => {
  it('renders navigation', () => {
    renderWithRouter([
      {
        path: '/',
        element: <App />,
        children: [{ index: true, element: <div>Home</div> }],
      },
    ]);

    expect(screen.getByTestId('navigation')).toBeInTheDocument();
  });

  it('renders header when route has title handle', () => {
    renderWithRouter([
      {
        path: '/',
        element: <App />,
        children: [
          {
            index: true,
            element: <div>Home</div>,
            handle: { title: 'Test Title' },
          },
        ],
      },
    ]);

    expect(screen.getByTestId('header')).toHaveTextContent('Test Title');
  });

  it('does not render header when no title in handle', () => {
    renderWithRouter([
      {
        path: '/',
        element: <App />,
        children: [{ index: true, element: <div>Home</div> }],
      },
    ]);

    expect(screen.queryByTestId('header')).not.toBeInTheDocument();
  });

  it('renders main element for content', () => {
    renderWithRouter([
      {
        path: '/',
        element: <App />,
        children: [{ index: true, element: <div>Home</div> }],
      },
    ]);

    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
