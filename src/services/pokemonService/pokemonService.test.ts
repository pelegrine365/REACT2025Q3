import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPokemonsBySearch } from '@services/pokemonService';
import * as apiByName from '@api/fetchPokemonByName';
import * as apiDefaultList from '@api/fetchDefaultPokemonList';
import type { BasePokemon } from '@types';
import { mockPokemon, mockPokemonList } from '@mocks/pokemon';

vi.mock('@api/fetchPokemonByName');
vi.mock('@api/fetchDefaultPokemonList');

describe('getPokemonsBySearch', () => {
  const mockFetchPokemonByName = (
    mockValue?: BasePokemon,
    shouldReject = false,
    errorValue?: Error
  ) => {
    const mockedFetch = vi.mocked(apiByName.fetchPokemonByName);
    if (shouldReject) {
      mockedFetch.mockRejectedValue(
        errorValue || new Error('Pokemon API error')
      );
    } else {
      mockedFetch.mockResolvedValue(mockValue || mockPokemon);
    }
    return mockedFetch;
  };

  const mockFetchDefaultPokemonList = (
    mockValue?: BasePokemon[],
    shouldReject = false,
    errorValue?: Error
  ) => {
    const mockedFetch = vi.mocked(apiDefaultList.fetchDefaultPokemonList);
    if (shouldReject) {
      mockedFetch.mockRejectedValue(
        errorValue || new Error('Pokemon API error')
      );
    } else {
      mockedFetch.mockResolvedValue(mockValue || mockPokemonList);
    }
    return mockedFetch;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls fetchPokemonByName with searchValue and returns single-item array when input is provided', async () => {
    const mockedFetch = mockFetchPokemonByName();

    const result = await getPokemonsBySearch('pickachu');

    expect(mockedFetch).toHaveBeenCalledWith('pickachu');
    expect(result).toEqual([mockPokemon]);
  });

  it('calls fetchDefaultPokemonList and returns list when input is empty', async () => {
    const mockedFetch = mockFetchDefaultPokemonList();

    const result = await getPokemonsBySearch('');

    expect(mockedFetch).toHaveBeenCalledWith();
    expect(result).toEqual(mockPokemonList);
  });

  it('throws error when fetchPokemonByName fails', async () => {
    const errorMessage = 'Pokemon not found';
    const error = new Error(errorMessage);
    mockFetchPokemonByName(undefined, true, error);

    await expect(getPokemonsBySearch('invalid')).rejects.toThrow(errorMessage);
  });

  it('throws error when fetchDefaultPokemonList fails', async () => {
    const errorMessage = 'Failed to fetch default list';
    const error = new Error(errorMessage);
    mockFetchDefaultPokemonList(undefined, true, error);

    await expect(getPokemonsBySearch('')).rejects.toThrow(errorMessage);
  });
});
