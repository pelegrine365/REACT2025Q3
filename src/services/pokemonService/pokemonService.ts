import { fetchPokemonByName } from '@api/fetchPokemonByName';
import { fetchPokemonsByIds } from '@api/fetchPokemonList';

import { POKEMONS_PER_REQUEST, MAX_POKEMON_ID } from '@constants';

import type { PaginatedPokemonListResponse } from '@types';

import { createPokemonIdsRange } from '@utils/createPokemonIdsRange';

export async function getPokemonsPaginatedList(
  page: number = 1,
  searchQuery: string
): Promise<PaginatedPokemonListResponse> {
  if (searchQuery) {
    const pokemon = await fetchPokemonByName(searchQuery);
    return {
      results: [pokemon],
      totalCount: 1,
      hasNext: false,
      hasPrev: false,
      currentPage: 1,
      totalPages: 1,
    };
  }

  const results = await fetchPokemonsByIds(createPokemonIdsRange(page));

  const totalCount = MAX_POKEMON_ID;
  const totalPages = Math.ceil(totalCount / POKEMONS_PER_REQUEST);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    results,
    totalCount,
    hasNext,
    hasPrev,
    currentPage: page,
    totalPages,
  };
}
