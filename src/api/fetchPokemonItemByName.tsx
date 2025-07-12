interface FlavorTextEntry {
  flavor_text: string;
  language: { name: string; url: string };
  version?: { name: string; url: string };
}

interface PokemonType {
  slot: number;
  type: { name: string; url: string };
}

export async function fetchPokemonByName(name: string) {
  const apiBaseUrl = 'https://pokeapi.co/api/v2';

  const pokemonResponse = await fetch(
    `${apiBaseUrl}/pokemon/${name.toLowerCase()}`
  );
  if (!pokemonResponse.ok) throw new Error('Not found');
  const pokemonData = await pokemonResponse.json();

  const speciesResponse = await fetch(
    `${apiBaseUrl}/pokemon-species/${name.toLowerCase()}`
  );
  const speciesData = await speciesResponse.json();

  const englishEntry = speciesData.flavor_text_entries.find(
    (entry: FlavorTextEntry) => entry.language.name === 'en'
  );
  const description = englishEntry
    ? englishEntry.flavor_text.replace(/[\n\f]/g, ' ')
    : '';

  return {
    id: pokemonData.id,
    name: pokemonData.name,
    image: pokemonData.sprites.other['official-artwork'].front_default,
    types: pokemonData.types.map((type: PokemonType) => type.type.name),
    description,
  };
}
