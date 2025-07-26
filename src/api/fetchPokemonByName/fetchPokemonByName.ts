import type { Pokemon } from '@types';

interface FlavorTextEntry {
  flavor_text: string;
  language: { name: string; url: string };
  version?: { name: string; url: string };
}

interface PokemonType {
  slot: number;
  type: { name: string; url: string };
}

export async function fetchPokemonByName(name: string): Promise<Pokemon> {
  const apiBaseUrl = 'https://pokeapi.co/api/v2';

  const pokemonResponse = await fetch(
    `${apiBaseUrl}/pokemon/${name.toLowerCase()}`
  );

  if (!pokemonResponse.ok)
    throw new Error(`${name.toUpperCase()} does not exist. Please try again.`);

  const pokemonData = await pokemonResponse.json();

  let description = '';

  try {
    const speciesResponse = await fetch(
      `${apiBaseUrl}/pokemon-species/${name.toLowerCase()}`
    );
    if (speciesResponse.ok) {
      const speciesData = await speciesResponse.json();
      const englishEntry = speciesData.flavor_text_entries.find(
        (entry: FlavorTextEntry) => entry.language.name === 'en'
      );
      description = englishEntry
        ? englishEntry.flavor_text.replace(/[\n\f]/g, ' ').trim()
        : '';
    }
  } catch (error) {
    console.warn(`Error fetching species for ${name}:`, error);
  }

  return {
    id: pokemonData.id,
    name: pokemonData.name,
    image: pokemonData.sprites.other['official-artwork'].front_default,
    types: pokemonData.types.map((type: PokemonType) => type.type.name),
    description: `${description || "Sorry, we couldn't find a description for this Pokémon"}`,
  };
}
