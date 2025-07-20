import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchPokemonByName } from './fetchPokemonItemByName';
import {
  mockSpeciesResponse,
  mockPokemonResponse,
  mockFailedPokemonResponse,
  mockFailedSpeciesResponse,
  mockSpeciesResponseWithoutEnglish,
} from '../__tests__/mocks/pokemon';

let mockFetch: ReturnType<typeof vi.mocked<typeof fetch>>;

beforeEach(() => {
  vi.restoreAllMocks();
  vi.stubGlobal('fetch', vi.fn());
  mockFetch = vi.mocked(fetch);
});

describe('fetchPokemonByName', () => {
  it('returns full Pokemon data including description', async () => {
    mockFetch
      .mockResolvedValueOnce(mockPokemonResponse as Response)
      .mockResolvedValueOnce(mockSpeciesResponse as Response);

    const result = await fetchPokemonByName('psyduck');

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/psyduck'
    );
    expect(fetch).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon-species/psyduck'
    );

    expect(result).toEqual({
      id: 54,
      name: 'psyduck',
      image:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png',
      types: ['water'],
      description:
        'While lulling its enemies with its vacant look, this wily POKéMON will use psychokinetic powers.',
    });
  });

  it('throws if first request (pokemon) fails', async () => {
    mockFetch.mockResolvedValueOnce(mockFailedPokemonResponse as Response);

    await expect(fetchPokemonByName('missingno')).rejects.toThrow(
      'MISSINGNO does not exist. Please try again.'
    );
  });

  it('falls back to default description if second request (species) fails with !ok', async () => {
    mockFetch
      .mockResolvedValueOnce(mockPokemonResponse as Response)
      .mockResolvedValueOnce(mockFailedSpeciesResponse as Response);

    const result = await fetchPokemonByName('psyduck');

    expect(result.description).toBe(
      "Sorry, we couldn't find a description for this Pokémon"
    );
  });

  it('falls back to default description if second request (species) throws', async () => {
    mockFetch
      .mockResolvedValueOnce(mockPokemonResponse as Response)
      .mockRejectedValueOnce(new Error('Species fetch failed'));

    const result = await fetchPokemonByName('psyduck');

    expect(result.description).toBe(
      "Sorry, we couldn't find a description for this Pokémon"
    );
  });

  it('falls back if no English flavor text exists', async () => {
    mockFetch
      .mockResolvedValueOnce(mockPokemonResponse as Response)
      .mockResolvedValueOnce(mockSpeciesResponseWithoutEnglish as Response);

    const result = await fetchPokemonByName('psyduck');

    expect(result.description).toBe(
      "Sorry, we couldn't find a description for this Pokémon"
    );
  });
});
