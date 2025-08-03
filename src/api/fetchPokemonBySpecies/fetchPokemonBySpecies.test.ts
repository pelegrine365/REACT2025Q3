import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchPokemonBySpecies } from './fetchPokemonBySpecies';
import {
  createSpeciesApiResponse,
  mockBulbasaurSpeciesApiResponse,
} from '@mocks/pokemon';

let mockFetch: ReturnType<typeof vi.mocked<typeof fetch>>;

beforeEach(() => {
  vi.restoreAllMocks();
  vi.stubGlobal('fetch', vi.fn());
  mockFetch = vi.mocked(fetch);
});

describe('fetchPokemonBySpecies', () => {
  it('returns parsed species data', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockBulbasaurSpeciesApiResponse),
    } as Partial<Response>;
    mockFetch.mockResolvedValueOnce(mockResponse as Response);

    const result = await fetchPokemonBySpecies('bulbasaur');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/pokemon-species/bulbasaur')
    );
    expect(result).toEqual({
      id: 1,
      name: 'bulbasaur',
      color: 'green',
      shape: 'quadruped',
      generation: 'generation-i',
      isLegendary: true,
      isMythical: false,
      description: 'Seed Pokémon.',
      genus: 'Seed Pokémon',
    });
  });

  it('throws if response is not ok', async () => {
    const mockResponse = { ok: false } as Partial<Response>;
    mockFetch.mockResolvedValueOnce(mockResponse as Response);
    await expect(fetchPokemonBySpecies('bad')).rejects.toThrow(
      'Error fetching species for bad'
    );
  });

  it('returns empty description and genus if not found', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(
        createSpeciesApiResponse({
          ...mockBulbasaurSpeciesApiResponse,
          flavor_text_entries: [],
          genera: [],
        })
      ),
    } as Partial<Response>;
    mockFetch.mockResolvedValueOnce(mockResponse as Response);
    const result = await fetchPokemonBySpecies('bulbasaur');
    expect(result.description).toBe('');
    expect(result.genus).toBe('');
  });
});
