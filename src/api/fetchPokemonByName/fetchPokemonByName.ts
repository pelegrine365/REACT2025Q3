import { API_BASE_URL } from '@constants';
import type { BasePokemon, PokemonApiResponse } from '@types';

export async function fetchPokemonByName(name: string): Promise<BasePokemon> {
  const pokemonResponse = await fetch(
    `${API_BASE_URL}/pokemon/${name.toLowerCase()}`
  );

  if (!pokemonResponse.ok)
    throw new Error(`${name.toUpperCase()} does not exist. Please try again.`);

  const pokemonData: PokemonApiResponse = await pokemonResponse.json();

  return {
    id: pokemonData.id,
    name: pokemonData.name,
    image: pokemonData.sprites.other['official-artwork'].front_default || '',
    types: pokemonData.types.map((type) => type.type.name),
    abilities: pokemonData.abilities.map((ability) => ability.ability.name),
    height: pokemonData.height,
    weight: pokemonData.weight,
    stats: pokemonData.stats.map((stat) => ({
      name: stat.stat.name,
      value: stat.base_stat,
    })),
  };
}
