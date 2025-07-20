import type { Pokemon } from '../../types';

export const mockPokemon: Pokemon = {
  id: 300,
  name: 'skitty',
  image:
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/300.png',
  types: ['normal'],
  description:
    'SKITTY has the habit of becoming fascinated by moving objects and chasing them around...',
};

export const mockPokemonList: Pokemon[] = [
  {
    id: 300,
    name: 'skitty',
    image:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/300.png',
    types: ['normal'],
    description:
      'SKITTY has the habit of becoming fascinated by moving objects and chasing them around...',
  },
  {
    id: 440,
    name: 'happiny',
    image:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/440.png',
    types: ['normal'],
    description:
      'It loves round white things.It carries an egg-shaped rock inimitation of CHANSEY.',
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
