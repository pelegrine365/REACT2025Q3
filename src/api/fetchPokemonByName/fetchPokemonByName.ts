import { API_BASE_URL } from '@constants';
import type { BasePokemon } from '@types';

interface PokemonType {
  slot: number;
  type: { name: string; url: string };
}

export async function fetchPokemonByName(name: string): Promise<BasePokemon> {
  const pokemonResponse = await fetch(
    `${API_BASE_URL}/pokemon/${name.toLowerCase()}`
  );

  if (!pokemonResponse.ok)
    throw new Error(`${name.toUpperCase()} does not exist. Please try again.`);

  const pokemonData = await pokemonResponse.json();

  return {
    id: pokemonData.id,
    name: pokemonData.name,
    image:
      pokemonData.sprites?.other?.['official-artwork']?.front_shiny ||
      pokemonData.sprites?.other?.['official-artwork']?.front_default ||
      '',
    types: pokemonData.types.map((type: PokemonType) => type.type.name),
    abilities: pokemonData.abilities.map(
      (ability: { ability: { name: string } }) => ability.ability.name
    ),
    height: pokemonData.height,
    weight: pokemonData.weight,
    stats: pokemonData.stats.map(
      (stat: { stat: { name: string }; base_stat: number }) => ({
        name: stat.stat.name,
        value: stat.base_stat,
      })
    ),
  };
}
