import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchPokemonByName } from './fetchPokemonByName';

let mockFetch: ReturnType<typeof vi.mocked<typeof fetch>>;

beforeEach(() => {
  vi.restoreAllMocks();
  vi.stubGlobal('fetch', vi.fn());
  mockFetch = vi.mocked(fetch);
});

const mockPokemonApiResponse = {
  id: 54,
  name: 'psyduck',
  sprites: {
    other: {
      'official-artwork': {
        front_default:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png',
        front_shiny: null,
      },
    },
  },
  types: [
    {
      slot: 1,
      type: { name: 'water', url: 'https://pokeapi.co/api/v2/type/11/' },
    },
  ],
  abilities: [
    { ability: { name: 'damp' } },
    { ability: { name: 'cloud-nine' } },
  ],
  height: 8,
  weight: 196,
  stats: [
    { stat: { name: 'hp' }, base_stat: 50 },
    { stat: { name: 'attack' }, base_stat: 52 },
    { stat: { name: 'defense' }, base_stat: 48 },
  ],
};

describe('fetchPokemonByName', () => {
  it('returns full Pokemon data with all required fields', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockPokemonApiResponse),
    } as Partial<Response>;

    mockFetch.mockResolvedValueOnce(mockResponse as Response);

    const result = await fetchPokemonByName('psyduck');

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/psyduck'
    );

    expect(result).toEqual({
      id: 54,
      name: 'psyduck',
      image:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png',
      types: ['water'],
      abilities: ['damp', 'cloud-nine'],
      height: 8,
      weight: 196,
      stats: [
        { name: 'hp', value: 50 },
        { name: 'attack', value: 52 },
        { name: 'defense', value: 48 },
      ],
    });
  });

  it('throws error when Pokemon does not exist', async () => {
    const mockFailedResponse = {
      ok: false,
      status: 404,
    } as Partial<Response>;

    mockFetch.mockResolvedValueOnce(mockFailedResponse as Response);

    await expect(fetchPokemonByName('missingno')).rejects.toThrow(
      'MISSINGNO does not exist. Please try again.'
    );
  });

  it('converts name to lowercase before making request', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockPokemonApiResponse),
    } as Partial<Response>;

    mockFetch.mockResolvedValueOnce(mockResponse as Response);

    await fetchPokemonByName('PSYDUCK');

    expect(fetch).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/psyduck'
    );
  });
});
