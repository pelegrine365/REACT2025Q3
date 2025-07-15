import { fetchPokemonByName } from '../api/fetchPokemonItemByName';
import { fetchDefaultPokemonList } from '../api/fetchDefaultPokemonList';
import type { Pokemon } from '../types';
// Update the import to match the actual export from '../constants'

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
