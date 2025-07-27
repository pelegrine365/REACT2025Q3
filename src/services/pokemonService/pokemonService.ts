import { fetchPokemonByName } from '@api/fetchPokemonByName';
import { fetchDefaultPokemonList } from '@api/fetchDefaultPokemonList';
import type { BasePokemon } from '@types';

export async function getPokemonsBySearch(
  inputValue: string
): Promise<BasePokemon[]> {
  if (inputValue) {
    const pokemon = await fetchPokemonByName(inputValue);
    return [pokemon];
  } else {
    return await fetchDefaultPokemonList();
  }
}
