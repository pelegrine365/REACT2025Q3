import { describe, it, expect } from 'vitest';
import { createPokemonIdsRange } from './createPokemonIdsRange';
import { POKEMONS_PER_REQUEST, MAX_POKEMON_ID } from '@constants';

describe('createPokemonIdsRange', () => {
  it('returns first page range correctly', () => {
    const range = createPokemonIdsRange(1);

    expect(range).toHaveLength(POKEMONS_PER_REQUEST);
    expect(range[0]).toBe(1);
    expect(range[range.length - 1]).toBe(POKEMONS_PER_REQUEST);
  });

  it('returns middle page range correctly', () => {
    const page = 5;
    const startId = (page - 1) * POKEMONS_PER_REQUEST + 1;
    const range = createPokemonIdsRange(page);

    expect(range).toEqual(
      Array.from({ length: POKEMONS_PER_REQUEST }, (_, i) => startId + i)
    );
  });

  it('returns last full page when MAX_POKEMON_ID is divisible by per request', () => {
    const totalPages = Math.ceil(MAX_POKEMON_ID / POKEMONS_PER_REQUEST);
    const range = createPokemonIdsRange(totalPages);
    const expectedStart = (totalPages - 1) * POKEMONS_PER_REQUEST + 1;
    const expectedEnd = MAX_POKEMON_ID;

    expect(range[0]).toBe(expectedStart);
    expect(range[range.length - 1]).toBe(expectedEnd);
    expect(range).toHaveLength(expectedEnd - expectedStart + 1);
  });

  it('returns empty array for page beyond range', () => {
    const beyondPage = Math.ceil(MAX_POKEMON_ID / POKEMONS_PER_REQUEST) + 1;
    const range = createPokemonIdsRange(beyondPage);

    expect(range).toEqual([]);
  });
});
