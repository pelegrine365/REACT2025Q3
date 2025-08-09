import { API_BASE_URL } from '@constants';
import type { PokemonSpecies } from '@types';

export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: NamedAPIResource;
  version: NamedAPIResource;
}

export async function fetchPokemonBySpecies(
  name: string
): Promise<PokemonSpecies> {
  const speciesResponse = await fetch(
    `${API_BASE_URL}/pokemon-species/${name.toLowerCase()}`
  );

  if (!speciesResponse.ok)
    throw new Error(`Error fetching species for ${name}: Please try again.`);

  let description = '';
  let isLegendary = false;
  let isMythical = false;

  const speciesData = await speciesResponse.json();
  const englishEntry = speciesData.flavor_text_entries.find(
    (entry: FlavorTextEntry) => entry.language.name === 'en'
  );
  description = englishEntry
    ? englishEntry.flavor_text.replace(/[\n\f]/g, ' ').trim()
    : '';
  isLegendary = speciesData.is_legendary || false;
  isMythical = speciesData.is_mythical || false;

  return {
    id: speciesData.id,
    name: speciesData.name,
    color: speciesData.color.name,
    shape: speciesData.shape.name,
    generation: speciesData.generation.name,
    isLegendary,
    isMythical,
    description,
    genus:
      speciesData.genera.find(
        (g: { language: { name: string } }) => g.language.name === 'en'
      )?.genus || '',
  };
}
