import type { BasePokemon, PokemonDetail } from '../../types';

export const mockPokemon: BasePokemon = {
  id: 300,
  name: 'skitty',
  image:
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/300.png',
  types: ['normal'],
  abilities: ['cute-charm', 'normalize'],
  height: 6,
  weight: 110,
  stats: [
    { name: 'hp', value: 50 },
    { name: 'attack', value: 45 },
    { name: 'defense', value: 45 },
    { name: 'special-attack', value: 35 },
    { name: 'special-defense', value: 35 },
    { name: 'speed', value: 50 },
  ],
};

export const mockPokemonDetail: PokemonDetail = {
  id: 300,
  name: 'skitty',
  image:
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/300.png',
  types: ['normal'],
  description:
    'SKITTY has the habit of becoming fascinated by moving objects and chasing them around...',
  abilities: ['cute-charm', 'normalize'],
  height: 6,
  weight: 110,
  stats: [
    { name: 'hp', value: 50 },
    { name: 'attack', value: 45 },
    { name: 'defense', value: 45 },
    { name: 'special-attack', value: 35 },
    { name: 'special-defense', value: 35 },
    { name: 'speed', value: 50 },
  ],
  baseExperience: 52,
  isLegendary: false,
};

export const mockPokemonList: BasePokemon[] = [
  {
    id: 300,
    name: 'skitty',
    image:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/300.png',
    types: ['normal'],
    abilities: ['cute-charm', 'normalize'],
    height: 6,
    weight: 110,
    stats: [
      { name: 'hp', value: 50 },
      { name: 'attack', value: 45 },
      { name: 'defense', value: 45 },
      { name: 'special-attack', value: 35 },
      { name: 'special-defense', value: 35 },
      { name: 'speed', value: 50 },
    ],
  },
  {
    id: 440,
    name: 'happiny',
    image:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/440.png',
    types: ['normal'],
    abilities: ['serene-grace', 'natural-cure'],
    height: 6,
    weight: 244,
    stats: [
      { name: 'hp', value: 100 },
      { name: 'attack', value: 5 },
      { name: 'defense', value: 5 },
      { name: 'special-attack', value: 15 },
      { name: 'special-defense', value: 65 },
      { name: 'speed', value: 30 },
    ],
  },
];

export const mockPokemonResponse: Partial<Response> = {
  ok: true,
  json: async () => ({
    id: 54,
    name: 'psyduck',
    sprites: {
      other: {
        'official-artwork': {
          front_default:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png',
        },
      },
    },
    types: [
      {
        slot: 1,
        type: { name: 'water', url: 'https://pokeapi.co/api/v2/type/11/' },
      },
    ],
  }),
};

export const mockFailedPokemonResponse: Partial<Response> = {
  ok: false,
  json: async () => ({}),
};

export const mockSpeciesResponse: Partial<Response> = {
  ok: true,
  json: async () => ({
    flavor_text_entries: [
      {
        flavor_text:
          'While lulling its\nenemies with its\nvacant look, this\fwily POKéMON will\nuse psychokinetic\npowers.',
        language: {
          name: 'en',
          url: 'https://pokeapi.co/api/v2/language/9/',
        },
      },
    ],
  }),
};

export const mockFailedSpeciesResponse: Partial<Response> = {
  ok: false,
  json: async () => ({}),
};

export const mockSpeciesResponseWithoutEnglish: Partial<Response> = {
  ok: true,
  json: async () => ({
    flavor_text_entries: [
      {
        flavor_text: 'Описание...',
        language: { name: 'ru', url: '' },
      },
    ],
  }),
};
