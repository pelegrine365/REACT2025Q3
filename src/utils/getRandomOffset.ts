import { DEFAULT_POKEMONS_LIMIT, MAX_POKEMON_COUNT } from '../constants';

export function getRandomOffset(): number {
  const maxOffset = MAX_POKEMON_COUNT - DEFAULT_POKEMONS_LIMIT;
  return Math.floor(Math.random() * maxOffset);
}
