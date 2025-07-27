import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router';
import HomePage from './HomePage';
import * as storage from '@api/searchQueryApi';
import * as service from '@services/pokemonService';
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

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('HomePage component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  it('renders SearchBar with saved value', async () => {
    vi.spyOn(storage, 'getSearchQuery').mockReturnValue('pikachu');
    vi.spyOn(service, 'getPokemonsPaginatedList').mockResolvedValue({
      results: [mockPokemonList[0]],
      totalCount: 1,
      hasNext: false,
      hasPrev: false,
      currentPage: 1,
      totalPages: 1,
    });

    renderWithRouter(<HomePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument();
    });
  });

  it('clears saved value on empty search', async () => {
    vi.spyOn(storage, 'getSearchQuery').mockReturnValue('pikachu');
    const clearSpy = vi.spyOn(storage, 'removeSearchQuery');
    vi.spyOn(service, 'getPokemonsPaginatedList').mockResolvedValue({
      results: mockPokemonList,
      totalCount: 1010,
      hasNext: true,
      hasPrev: false,
      currentPage: 1,
      totalPages: 101,
    });

    renderWithRouter(<HomePage />);

    const input = screen.getByPlaceholderText('Write the request...');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(clearSpy).toHaveBeenCalled();
    });
  });

  it('shows error message on API failure', async () => {
    vi.spyOn(storage, 'getSearchQuery').mockReturnValue('');
    vi.spyOn(service, 'getPokemonsPaginatedList').mockRejectedValue(
      new Error('API call failed')
    );

    renderWithRouter(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText('API call failed')).toBeInTheDocument();
    });
  });
});
