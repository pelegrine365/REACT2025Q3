import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useContext } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import selectedItemsReducer from 'store/selectedItemsSlice';
import {
  createMemoryRouter,
  RouterProvider,
  type RouteObject,
} from 'react-router';
import { mockPokemonList } from '@mocks/pokemon';
import type { BasePokemon } from '@types';
import { ThemeContext } from 'contexts';
import App from './App';

vi.mock('@components/Navigation', () => ({
  default: () => <div data-testid="navigation" />,
}));
vi.mock('@components/Header', () => ({
  default: ({ title }: { title: string }) => (
    <div data-testid="header">{title}</div>
  ),
}));
vi.mock('@components/ThemeButton', () => ({
  default: () => <div data-testid="theme-button" />,
}));
vi.mock('@components/BulkActionsToolbar', () => ({
  default: ({ selectedItems }: { selectedItems: BasePokemon[] }) => (
    <div data-testid="bulk-actions-toolbar">
      {selectedItems.length} items selected
    </div>
  ),
}));

const createTestStore = (selectedItems: BasePokemon[] = []) =>
  configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
    },
    preloadedState: {
      selectedItems: {
        selectedItems,
      },
    },
  });

const renderWithProviders = (
  routes: RouteObject[],
  selectedItems: BasePokemon[] = []
) => {
  const store = createTestStore(selectedItems);
  const router = createMemoryRouter(routes, { initialEntries: ['/'] });
  return render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

describe('App layout component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders navigation component', () => {
    renderWithProviders([
      {
        path: '/',
        element: <App />,
        children: [{ index: true, element: <div>Home</div> }],
      },
    ]);

    expect(screen.getByTestId('navigation')).toBeInTheDocument();
  });

  it('renders theme button', () => {
    renderWithProviders([
      {
        path: '/',
        element: <App />,
        children: [{ index: true, element: <div>Home</div> }],
      },
    ]);

    expect(screen.getByTestId('theme-button')).toBeInTheDocument();
  });

  it('renders header when route has title handle', () => {
    renderWithProviders([
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
    renderWithProviders([
      {
        path: '/',
        element: <App />,
        children: [{ index: true, element: <div>Home</div> }],
      },
    ]);

    expect(screen.queryByTestId('header')).not.toBeInTheDocument();
  });

  it('renders main element for content', () => {
    renderWithProviders([
      {
        path: '/',
        element: <App />,
        children: [{ index: true, element: <div>Home</div> }],
      },
    ]);

    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders app container with default theme class', () => {
    renderWithProviders([
      {
        path: '/',
        element: <App />,
        children: [{ index: true, element: <div>Home</div> }],
      },
    ]);

    const appContainer = screen.getByRole('main').parentElement;
    expect(appContainer).toHaveClass('app-container', 'theme-light');
  });

  it('does not render BulkActionsToolbar when no items selected', () => {
    renderWithProviders([
      {
        path: '/',
        element: <App />,
        children: [{ index: true, element: <div>Home</div> }],
      },
    ]);

    expect(
      screen.queryByTestId('bulk-actions-toolbar')
    ).not.toBeInTheDocument();
  });

  it('renders BulkActionsToolbar when items are selected', () => {
    const selectedItems = [mockPokemonList[0], mockPokemonList[1]];

    renderWithProviders(
      [
        {
          path: '/',
          element: <App />,
          children: [{ index: true, element: <div>Home</div> }],
        },
      ],
      selectedItems
    );

    expect(screen.getByTestId('bulk-actions-toolbar')).toBeInTheDocument();
    expect(screen.getByText('2 items selected')).toBeInTheDocument();
  });

  it('renders outlet for nested routes', () => {
    renderWithProviders([
      {
        path: '/',
        element: <App />,
        children: [
          {
            index: true,
            element: <div data-testid="child-content">Home Content</div>,
          },
        ],
      },
    ]);

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('provides theme context to children components', () => {
    const TestChild = () => {
      const { theme } = useContext(ThemeContext);
      return <div data-testid="theme-value">{theme}</div>;
    };

    renderWithProviders([
      {
        path: '/',
        element: <App />,
        children: [{ index: true, element: <TestChild /> }],
      },
    ]);

    expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
  });
});
