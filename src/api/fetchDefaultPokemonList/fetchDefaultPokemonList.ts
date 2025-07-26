import { POKEMON_TOTAL_COUNT, POKEMONS_PER_REQUEST } from '@constants';
import { fetchPokemonByName } from '@api/fetchPokemonByName';
import { getRandomOffset } from '@utils/getRandomOffset';
import type { Pokemon } from '@types';

export async function fetchDefaultPokemonList(): Promise<Pokemon[]> {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${POKEMONS_PER_REQUEST}&offset=${getRandomOffset(POKEMON_TOTAL_COUNT, POKEMONS_PER_REQUEST)}`
  );

  if (!response.ok) {
    throw new Error(
      'Oppps! Something went wrong while fetching the Pokemon list.'
    );
  }

  const data = await response.json();

  const promises = data.results.map(async (item: { name: string }) =>
    fetchPokemonByName(item.name)
  );

  return Promise.all(promises);
}
