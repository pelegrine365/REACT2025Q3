export interface BasePokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  abilities: string[];
  height: number;
  weight: number;
  stats: PokemonStat[];
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

export interface PaginatedPokemonListResponse {
  results: BasePokemon[];
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
  currentPage: number;
  totalPages: number;
}

export interface PokemonStat {
  name: string;
  value: number;
}

export interface PokemonAbility {
  name: string;
  url: string;
  isHidden?: boolean;
}

export interface PokemonType {
  name: string;
  url: string;
  slot: number;
}

export interface PokemonApiStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonApiAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonApiType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonApiResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string | null;
        front_shiny: string | null;
      };
    };
  };
  types: PokemonApiType[];
  abilities: PokemonApiAbility[];
  stats: PokemonApiStat[];
}
