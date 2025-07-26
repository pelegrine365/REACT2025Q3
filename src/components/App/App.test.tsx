import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
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

describe('App component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  it('renders SearchBar with saved value', async () => {
    vi.spyOn(storage, 'getSearchQuery').mockReturnValue('pikachu');
    vi.spyOn(service, 'getPokemonsBySearch').mockResolvedValue(mockPokemonList);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument();
    });
  });

  it('clears saved value on empty search', async () => {
    vi.spyOn(storage, 'getSearchQuery').mockReturnValue('pikachu');
    const clearSpy = vi.spyOn(storage, 'removeSearchQuery');
    vi.spyOn(service, 'getPokemonsBySearch').mockResolvedValue(mockPokemonList);

    render(<App />);

    const input = screen.getByPlaceholderText('Write the request...');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(clearSpy).toHaveBeenCalled();
    });
  });

  it('shows error message on API failure', async () => {
    vi.spyOn(storage, 'getSearchQuery').mockReturnValue('');
    vi.spyOn(service, 'getPokemonsBySearch').mockRejectedValue(
      new Error('API call failed')
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('API call failed')).toBeInTheDocument();
    });
  });
});
