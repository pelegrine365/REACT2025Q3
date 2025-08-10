import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CardsPage from '.';
import * as storage from '@api/searchQueryApi';
import { pokemonApi } from '@api/pokemonApi';
import { mockPokemonList } from '@mocks/pokemon';

vi.mock('@components/CardList', () => ({
  default: ({ results }: { results: typeof mockPokemonList }) => (
    <div>
      {results.map((pokemon) => (
        <div key={pokemon.id} data-testid="card-item">
          {pokemon.name}
        </div>
      ))}
    </div>
  ),
}));

vi.mock('@components/Pagination', () => ({
  default: () => <div data-testid="pagination">Pagination</div>,
}));

const mockFetch = vi.fn();
Object.defineProperty(globalThis, 'fetch', {
  value: mockFetch,
  writable: true,
});

const createMockResponse = (
  data: unknown | { message: string },
  ok = true,
  status = 200
) => {
  const jsonMock = vi.fn().mockResolvedValue(data);
  const response = {
    ok,
    status,
    statusText: ok ? 'OK' : 'Error',
    headers: new Headers({ 'content-type': 'application/json' }),
    json: jsonMock,
    text: vi.fn().mockResolvedValue(JSON.stringify(data)),
    clone: vi.fn().mockReturnValue({
      ok,
      status,
      statusText: ok ? 'OK' : 'Error',
      headers: new Headers({ 'content-type': 'application/json' }),
      json: vi.fn().mockResolvedValue(data),
      text: vi.fn().mockResolvedValue(JSON.stringify(data)),
    }),
  };
  return Promise.resolve(response as unknown as Response);
};

const createTestStore = () => {
  return configureStore({
    reducer: {
      [pokemonApi.reducerPath]: pokemonApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pokemonApi.middleware),
  });
};

const renderWithProviders = (component: React.ReactElement) => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe('CardsPage component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockFetch.mockClear();
  });

  it('renders SearchBar with saved value', async () => {
    vi.spyOn(storage, 'getSearchQuery').mockReturnValue('pikachu');

    const mockPikachuResponse = {
      id: 25,
      name: 'pikachu',
      sprites: {
        other: {
          'official-artwork': {
            front_default: 'https://example.com/pikachu.png',
          },
        },
      },
      types: [{ type: { name: 'electric' } }],
      abilities: [{ ability: { name: 'static' } }],
      height: 4,
      weight: 60,
      stats: [{ stat: { name: 'hp' }, base_stat: 35 }],
    };

    mockFetch.mockReturnValueOnce(createMockResponse(mockPikachuResponse));

    renderWithProviders(<CardsPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument();
    });
  });

  it('clears saved value on empty search', async () => {
    vi.spyOn(storage, 'getSearchQuery').mockReturnValue('pikachu');
    const clearSpy = vi.spyOn(storage, 'removeSearchQuery');

    Array.from({ length: 10 }, (_, i) => {
      const mockResponse = {
        id: i + 1,
        name: `pokemon-${i + 1}`,
        sprites: {
          other: {
            'official-artwork': {
              front_default: `https://example.com/pokemon-${i + 1}.png`,
            },
          },
        },
        types: [{ type: { name: 'normal' } }],
        abilities: [{ ability: { name: 'ability' } }],
        height: 4,
        weight: 60,
        stats: [{ stat: { name: 'hp' }, base_stat: 35 }],
      };
      mockFetch.mockReturnValueOnce(createMockResponse(mockResponse));
    });

    renderWithProviders(<CardsPage />);

    const input = screen.getByPlaceholderText('Write the request...');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(clearSpy).toHaveBeenCalled();
    });
  });
  it('shows error message on API failure', async () => {
    vi.spyOn(storage, 'getSearchQuery').mockReturnValue('nonexistent');

    mockFetch.mockReturnValueOnce(
      createMockResponse({ message: 'Not Found' }, false, 404)
    );

    renderWithProviders(<CardsPage />);

    await waitFor(() => {
      expect(
        screen.getByText(/NONEXISTENT does not exist/)
      ).toBeInTheDocument();
    });
  });
});
