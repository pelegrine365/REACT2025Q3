import type { Pokemon } from '../types';
import { fetchPokemonByName } from './fetchPokemonItemByName';

const offsetNumber = Math.floor(Math.random() * 30) + 1;

export async function fetchDefaultPokemonList(
  count: number
): Promise<Pokemon[]> {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${count}&offset=${offsetNumber}`
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
