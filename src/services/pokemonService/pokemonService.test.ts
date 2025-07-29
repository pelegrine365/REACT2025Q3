import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPokemonsPaginatedList } from './pokemonService';
import { fetchPokemonByName } from '@api/fetchPokemonByName';
import { fetchPokemonsByIds } from '@api/fetchPokemonList';
import { createPokemonIdsRange } from '@utils/createPokemonIdsRange';
import { MAX_POKEMON_ID, POKEMONS_PER_REQUEST } from '@constants';

vi.mock('@api/fetchPokemonByName', () => ({ fetchPokemonByName: vi.fn() }));
vi.mock('@api/fetchPokemonList', () => ({ fetchPokemonsByIds: vi.fn() }));
vi.mock('@utils/createPokemonIdsRange', () => ({
  createPokemonIdsRange: vi.fn(),
}));

const mockFetchPokemonByName = vi.mocked(fetchPokemonByName);
const mockFetchPokemonsByIds = vi.mocked(fetchPokemonsByIds);
const mockCreatePokemonIdsRange = vi.mocked(createPokemonIdsRange);

describe('getPokemonsPaginatedList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns single pokemon if searchQuery is provided', async () => {
    const mockPokemon = {
      id: 1,
      name: 'bulbasaur',
      image: 'img.png',
      types: ['grass'],
      abilities: ['overgrow'],
      height: 7,
      weight: 69,
      stats: [{ name: 'hp', value: 45 }],
    };
    mockFetchPokemonByName.mockResolvedValue(mockPokemon);
    const result = await getPokemonsPaginatedList(1, 'bulbasaur');
    expect(fetchPokemonByName).toHaveBeenCalledWith('bulbasaur');
    expect(result).toMatchObject({
      results: [mockPokemon],
      totalCount: 1,
      hasNext: false,
      hasPrev: false,
      currentPage: 1,
      totalPages: 1,
    });
  });

  it('returns paginated pokemons if no searchQuery', async () => {
    mockCreatePokemonIdsRange.mockReturnValue([1, 2, 3]);
    const pokemons = [
      {
        id: 1,
        name: 'bulbasaur',
        image: 'img1.png',
        types: ['grass'],
        abilities: ['overgrow'],
        height: 7,
        weight: 69,
        stats: [{ name: 'hp', value: 45 }],
      },
      {
        id: 2,
        name: 'ivysaur',
        image: 'img2.png',
        types: ['grass', 'poison'],
        abilities: ['overgrow'],
        height: 10,
        weight: 130,
        stats: [{ name: 'hp', value: 60 }],
      },
      {
        id: 3,
        name: 'venusaur',
        image: 'img3.png',
        types: ['grass', 'poison'],
        abilities: ['overgrow'],
        height: 20,
        weight: 1000,
        stats: [{ name: 'hp', value: 80 }],
      },
    ];
    mockFetchPokemonsByIds.mockResolvedValue(pokemons);
    const result = await getPokemonsPaginatedList(2, '');
    expect(createPokemonIdsRange).toHaveBeenCalledWith(2);
    expect(fetchPokemonsByIds).toHaveBeenCalledWith([1, 2, 3]);
    expect(result.results).toHaveLength(3);
    expect(result.currentPage).toBe(2);
    expect(result.totalCount).toBe(MAX_POKEMON_ID);
    expect(result.totalPages).toBe(
      Math.ceil(MAX_POKEMON_ID / POKEMONS_PER_REQUEST)
    );
    expect(result.hasNext).toBeTypeOf('boolean');
    expect(result.hasPrev).toBeTypeOf('boolean');
  });
});
