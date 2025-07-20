import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPokemonsBySearch } from './pokemonService';

import * as apiByName from '../api/fetchPokemonItemByName';
import * as apiDefaultList from '../api/fetchDefaultPokemonList';
import { mockPokemon, mockPokemonList } from '../__tests__/mocks/pokemon';

vi.mock('../api/fetchPokemonItemByName');
vi.mock('../api/fetchDefaultPokemonList');

describe('getPokemonsBySearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls fetchPokemonByName with searchValue and returns single-item array when input is provided', async () => {
    const mockedFetch = vi.mocked(apiByName.fetchPokemonByName);
    mockedFetch.mockResolvedValue(mockPokemon);

    const result = await getPokemonsBySearch('pickachu');

    expect(mockedFetch).toHaveBeenCalledWith('pickachu');
    expect(result).toEqual([mockPokemon]);
  });
});

it('calls fetchDefaultPokemonList and returns list when input is empty', async () => {
  const mockedFetch = vi.mocked(apiDefaultList.fetchDefaultPokemonList);
  mockedFetch.mockResolvedValue(mockPokemonList);

  const result = await getPokemonsBySearch('');

  expect(mockedFetch).toHaveBeenCalled();
  expect(result).toEqual(mockPokemonList);
});

it('throws if fetchPokemonByName rejects', async () => {
  const mockedFetch = vi.mocked(apiByName.fetchPokemonByName);
  mockedFetch.mockRejectedValue(new Error('Pokemon API error'));

  await expect(getPokemonsBySearch('KINGLER')).rejects.toThrow(
    'Pokemon API error'
  );
});

it('throws if fetchDefaultPokemonList rejects', async () => {
  const mockedFetch = vi.mocked(apiDefaultList.fetchDefaultPokemonList);
  mockedFetch.mockRejectedValue(new Error('Pokemon API error'));

  await expect(getPokemonsBySearch('')).rejects.toThrow('Pokemon API error');
});
