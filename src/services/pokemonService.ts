import { fetchPokemonByName } from '../api/fetchPokemonItemByName';
import { fetchDefaultPokemonList } from '../api/fetchDefaultPokemonList';
import type { Pokemon } from '../types';

export async function getPokemonsBySearch(
  inputValue: string
): Promise<Pokemon[]> {
  if (inputValue) {
    const pokemon = await fetchPokemonByName(inputValue);
    return [pokemon];
  } else {
    return await fetchDefaultPokemonList();
  }
}
