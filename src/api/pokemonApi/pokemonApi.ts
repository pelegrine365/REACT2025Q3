import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@constants';
import type { PokemonSpecies, BasePokemon, PokemonApiResponse } from '@types';

interface SpeciesApiResponse {
  id: number;
  name: string;
  color: { name: string };
  shape: { name: string };
  generation: { name: string };
  is_legendary: boolean;
  is_mythical: boolean;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: { name: string };
  }>;
  genera: Array<{ genus: string; language: { name: string } }>;
}

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  tagTypes: ['Pokemon', 'Species'],
  endpoints: (builder) => ({
    getPokemonSpecies: builder.query<PokemonSpecies, string>({
      query: (name) => `pokemon-species/${name.toLowerCase()}`,
      providesTags: (_result, _error, name) => [{ type: 'Species', id: name }],
      transformResponse: (response: SpeciesApiResponse): PokemonSpecies => {
        const englishDescription =
          response.flavor_text_entries
            ?.find((entry) => entry.language.name === 'en')
            ?.flavor_text?.replace(/[\n\f]/g, ' ')
            .trim() || '';

        const englishGenus =
          response.genera?.find((genus) => genus.language.name === 'en')
            ?.genus || '';

        return {
          id: response.id,
          name: response.name,
          color: response.color?.name || '',
          shape: response.shape?.name || '',
          generation: response.generation?.name || '',
          isLegendary: response.is_legendary || false,
          isMythical: response.is_mythical || false,
          description: englishDescription,
          genus: englishGenus,
        };
      },
    }),

    getPokemon: builder.query<BasePokemon, string | number>({
      query: (nameOrId) => `pokemon/${nameOrId.toString().toLowerCase()}`,
      providesTags: (_result, _error, nameOrId) => [
        { type: 'Pokemon', id: nameOrId },
        { type: 'Pokemon', id: 'LIST' },
      ],
      transformResponse: (response: PokemonApiResponse): BasePokemon => ({
        id: response.id,
        name: response.name,
        image: response.sprites.other['official-artwork'].front_default || '',
        types: response.types.map((type) => type.type.name),
        abilities: response.abilities.map((ability) => ability.ability.name),
        height: response.height,
        weight: response.weight,
        stats: response.stats.map((stat) => ({
          name: stat.stat.name,
          value: stat.base_stat,
        })),
      }),
    }),
  }),
});

export const { useGetPokemonSpeciesQuery, useGetPokemonQuery } = pokemonApi;
