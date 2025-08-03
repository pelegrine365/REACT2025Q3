import { fetchPokemonByName } from '@api/fetchPokemonByName';
import type { BasePokemon } from '@types';

export async function fetchPokemonsByIds(
  ids: number[]
): Promise<BasePokemon[]> {
  const promises = ids.map(async (id) => {
    try {
      return await fetchPokemonByName(id.toString());
    } catch {
      return null;
    }
  });

  const results = await Promise.all(promises);
  return results.filter((pokemon): pokemon is BasePokemon => pokemon !== null);
}
