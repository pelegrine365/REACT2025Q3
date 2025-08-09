export interface BasePokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  abilities: string[];
  height: number;
  weight: number;
  stats: Array<{
    name: string;
    value: number;
  }>;
}

export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
}

export interface PokemonDetail extends BasePokemon {
  description: string;
  baseExperience: number;
  isLegendary: boolean;
}

export interface PokemonSpecies {
  name: string;
  id: number;
  color: string;
  shape: string;
  generation: string;
  description: string;
  isLegendary: boolean;
  isMythical: boolean;
  genus: string;
}

export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: NamedAPIResource;
  version: NamedAPIResource;
}

export interface PaginatedPokemonListResponse {
  results: BasePokemon[];
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
  currentPage: number;
  totalPages: number;
}

export interface GithubUser {
  name: string;
  avatarURL: string;
  userURL: string;
}

export interface GithubRawUser {
  name: string;
  avatar_url: string;
  html_url: string;
}

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}
