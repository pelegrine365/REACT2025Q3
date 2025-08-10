import { useGetPokemonQuery } from '@api/pokemonApi';
import type { BasePokemon } from '@types';
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

interface UsePokemonListResult {
  data: BasePokemon[];
  isLoading: boolean;
  error: FetchBaseQueryError | SerializedError | undefined;
}

export function usePokemonList(
  ids: number[],
  skip: boolean = false
): UsePokemonListResult {
  const pokemon1 = useGetPokemonQuery(ids[0] || 0, { skip: skip || !ids[0] });
  const pokemon2 = useGetPokemonQuery(ids[1] || 0, { skip: skip || !ids[1] });
  const pokemon3 = useGetPokemonQuery(ids[2] || 0, { skip: skip || !ids[2] });
  const pokemon4 = useGetPokemonQuery(ids[3] || 0, { skip: skip || !ids[3] });
  const pokemon5 = useGetPokemonQuery(ids[4] || 0, { skip: skip || !ids[4] });
  const pokemon6 = useGetPokemonQuery(ids[5] || 0, { skip: skip || !ids[5] });
  const pokemon7 = useGetPokemonQuery(ids[6] || 0, { skip: skip || !ids[6] });
  const pokemon8 = useGetPokemonQuery(ids[7] || 0, { skip: skip || !ids[7] });
  const pokemon9 = useGetPokemonQuery(ids[8] || 0, { skip: skip || !ids[8] });
  const pokemon10 = useGetPokemonQuery(ids[9] || 0, { skip: skip || !ids[9] });

  const queries = [
    pokemon1,
    pokemon2,
    pokemon3,
    pokemon4,
    pokemon5,
    pokemon6,
    pokemon7,
    pokemon8,
    pokemon9,
    pokemon10,
  ];

  const data = queries
    .filter((query): query is typeof query & { data: BasePokemon } =>
      Boolean(query.data)
    )
    .map((query) => query.data);

  const isLoading = queries.some((query) => query.isLoading);

  const error = queries.find((query) => query.error)?.error;

  return {
    data,
    isLoading,
    error,
  };
}
