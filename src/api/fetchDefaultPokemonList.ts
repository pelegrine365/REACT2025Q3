import { DEFAULT_POKEMONS_LIMIT } from '../constants';
import type { Pokemon } from '../types';
import { getRandomOffset } from '../utils/getRandomOffset';
import { fetchPokemonByName } from './fetchPokemonItemByName';

export async function fetchDefaultPokemonList(): Promise<Pokemon[]> {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${DEFAULT_POKEMONS_LIMIT}&offset=${getRandomOffset()}`
  );

  if (!response.ok) {
    throw new Error('Not found');
  }

  const data = await response.json();

  const promises = data.results.map(async (item: { name: string }) =>
    fetchPokemonByName(item.name)
  );

  return Promise.all(promises);
}
