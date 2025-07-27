import { MAX_POKEMON_ID, POKEMONS_PER_REQUEST } from '@constants';

export function createPokemonIdsRange(page: number): number[] {
  const startId = (page - 1) * POKEMONS_PER_REQUEST + 1;
  const endId = Math.min(startId + POKEMONS_PER_REQUEST - 1, MAX_POKEMON_ID);

  return Array.from({ length: endId - startId + 1 }, (_, i) => startId + i);
}
