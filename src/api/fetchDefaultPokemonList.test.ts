import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchDefaultPokemonList } from './fetchDefaultPokemonList';
import * as fetchByName from './fetchPokemonItemByName';
import { POKEMONS_PER_REQUEST } from '../constants';
import * as getOffsetUtil from '../utils/getRandomOffset';
import { mockPokemonList } from '../__tests__/mocks/pokemon';
import type { Pokemon } from '../types';

const createMockResponse = (responseInit: Partial<Response>): Response => {
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    ...responseInit,
  } as Response;
};

describe('fetchDefaultPokemonList', () => {
  const mockPokemonData = mockPokemonList.map((pokemon) => ({
    name: pokemon.name,
  }));

  let mockFetch: ReturnType<typeof vi.mocked<typeof fetch>>;

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('fetch', vi.fn());
    mockFetch = vi.mocked(fetch);
  });

  it('fetches list and resolves with Pokemon data', async () => {
    vi.spyOn(getOffsetUtil, 'getRandomOffset').mockReturnValue(42);

    const mockResponse = createMockResponse({
      ok: true,
      json: () => Promise.resolve({ results: mockPokemonData }),
    });
    mockFetch.mockResolvedValue(mockResponse);

    const fetchByNameSpy = vi
      .spyOn(fetchByName, 'fetchPokemonByName')
      .mockImplementation(
        (name: string): Promise<Pokemon> =>
          Promise.resolve({
            id: 1,
            name,
            image: '',
            types: [],
            description: '',
          })
      );
    const result = await fetchDefaultPokemonList();

    expect(fetch).toHaveBeenCalledWith(
      `https://pokeapi.co/api/v2/pokemon?limit=${POKEMONS_PER_REQUEST}&offset=42`
    );
    expect(fetchByNameSpy).toHaveBeenCalledTimes(mockPokemonList.length);
    expect(result).toEqual([
      { id: 1, name: 'skitty', image: '', types: [], description: '' },
      { id: 1, name: 'happiny', image: '', types: [], description: '' },
    ]);
  });

  it('throws error when response.ok is false', async () => {
    const mockResponse = createMockResponse({ ok: false });
    mockFetch.mockResolvedValue(mockResponse);

    await expect(fetchDefaultPokemonList()).rejects.toThrow(
      'Oppps! Something went wrong while fetching the Pokemon list.'
    );
  });

  it('throws if fetch fails', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    await expect(fetchDefaultPokemonList()).rejects.toThrow('Network error');
  });

  it('throws if response.json fails', async () => {
    const mockResponse = createMockResponse({
      ok: true,
      json: () => Promise.reject(new Error('Bad JSON')),
    });
    mockFetch.mockResolvedValue(mockResponse);

    await expect(fetchDefaultPokemonList()).rejects.toThrow('Bad JSON');
  });
});
