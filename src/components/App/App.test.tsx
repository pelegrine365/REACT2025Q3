import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import * as storage from '../../api/searchStorage';
import * as service from '../../services/pokemonService';
import { mockPokemonList } from '../../__tests__/mocks/pokemon';

vi.mock('../CardList/CardList', () => ({
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

  it('renders SearchBar with saved value', () => {
    vi.spyOn(storage, 'getSavedSearchValue').mockReturnValue('pikachu');
    vi.spyOn(service, 'getPokemonsBySearch').mockResolvedValue(mockPokemonList);

    render(<App />);
    expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument();
  });

  it('clears saved value on empty search', async () => {
    vi.spyOn(storage, 'getSavedSearchValue').mockReturnValue('');
    const clearSpy = vi.spyOn(storage, 'clearSearchValue');
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
    vi.spyOn(storage, 'getSavedSearchValue').mockReturnValue('');
    vi.spyOn(service, 'getPokemonsBySearch').mockRejectedValue(
      new Error('API call failed')
    );

    render(<App />);
    await screen.findByText('API call failed');
  });

  it('catches error in ErrorBoundary', async () => {
    vi.spyOn(storage, 'getSavedSearchValue').mockReturnValue('');
    vi.spyOn(service, 'getPokemonsBySearch').mockResolvedValue([]);

    render(<App />);
    fireEvent.click(screen.getByText('Try error'));

    await screen.findByText('Ooooops...');
  });
});
