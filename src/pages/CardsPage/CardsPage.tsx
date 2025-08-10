import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router';

import CardList from '@components/CardList';
import ErrorMessage from '@components/ErrorMessage';
import SearchBar from '@components/SearchBar';
import Spinner from '@components/Spinner';
import CardDetail from '@components/CardDetail';
import TwoColumnLayout from '@components/TwoColumnLayout';
import Pagination from '@components/Pagination';
import RefreshButton from '@components/RefreshButton';

import { useSearchQuery } from '@hooks/useSearchQuery';
import { useTheme } from '@hooks/useTheme';
import { useGetPokemonQuery, pokemonApi } from '@api/pokemonApi';
import { usePokemonList } from '@hooks/usePokemonList';
import { useDispatch } from 'react-redux';

import { POKEMONS_PER_REQUEST, MAX_POKEMON_ID } from '@constants';
import { createPokemonIdsRange } from '@utils/createPokemonIdsRange';

import type { BasePokemon } from '@types';

import './index.css';

const CardsPage = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [selectedPokemon, setSelectedPokemon] = useState<BasePokemon | null>(
    null
  );

  const { searchQuery, updateSearchQuery } = useSearchQuery();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const detailsId = searchParams.get('details');

  const isSearchMode = Boolean(searchQuery);

  const pokemonIds = useMemo(() => {
    if (isSearchMode) return [];
    return createPokemonIdsRange(currentPage);
  }, [currentPage, isSearchMode]);

  const {
    data: searchData,
    isLoading: searchIsLoading,
    error: searchError,
    refetch: searchRefetch,
  } = useGetPokemonQuery(searchQuery, {
    skip: !isSearchMode,
  });

  const pokemonListResult = usePokemonList(pokemonIds, isSearchMode);

  const results: BasePokemon[] = useMemo(() => {
    if (isSearchMode && searchData) {
      return [searchData];
    }
    return pokemonListResult.data;
  }, [isSearchMode, searchData, pokemonListResult.data]);

  const isLoading = isSearchMode
    ? searchIsLoading
    : pokemonListResult.isLoading;

  const error = isSearchMode ? searchError : pokemonListResult.error;

  const paginationData = useMemo(() => {
    if (isSearchMode) {
      return {
        totalCount: searchData ? 1 : 0,
        hasNext: false,
        hasPrev: false,
        currentPage: 1,
        totalPages: 1,
      };
    }

    const totalCount = MAX_POKEMON_ID;
    const totalPages = Math.ceil(totalCount / POKEMONS_PER_REQUEST);
    const hasNext = currentPage < totalPages;
    const hasPrev = currentPage > 1;

    return {
      totalCount,
      hasNext,
      hasPrev,
      currentPage,
      totalPages,
    };
  }, [isSearchMode, searchData, currentPage]);

  const errorMessage = useMemo(() => {
    if (!error) return '';

    if ('status' in error) {
      if (error.status === 404) {
        return `${searchQuery.toUpperCase()} does not exist. Please try again.`;
      }
      return `Error ${error.status}: Failed to fetch data`;
    }

    return 'An unexpected error occurred';
  }, [error, searchQuery]);

  const handleSearch = (inputValue: string) => {
    updateSearchQuery(inputValue);
    setSearchParams({});
    setSelectedPokemon(null);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    if (newPage === 1) {
      params.delete('page');
    } else {
      params.set('page', newPage.toString());
    }
    params.delete('details');
    setSearchParams(params);
    setSelectedPokemon(null);
  };

  const handleCardClick = (pokemonId: number) => {
    const pokemon = results.find((p) => p.id === pokemonId);
    if (pokemon) {
      setSelectedPokemon(pokemon);
      const params = new URLSearchParams(searchParams);
      params.set('details', pokemonId.toString());
      setSearchParams(params);
    }
  };

  const handleCloseDetail = () => {
    setSelectedPokemon(null);
    const params = new URLSearchParams(searchParams);
    params.delete('details');
    setSearchParams(params);
  };

  const handleRefetch = () => {
    if (isSearchMode) {
      searchRefetch();
    } else {
      dispatch(
        pokemonApi.util.invalidateTags([
          { type: 'Pokemon', id: 'LIST' },
          ...pokemonIds.map((id) => ({ type: 'Pokemon' as const, id })),
        ])
      );
    }
  };

  useEffect(() => {
    if (detailsId && results.length > 0) {
      const pokemon = results.find((p) => p.id === parseInt(detailsId, 10));
      setSelectedPokemon(pokemon || null);
    } else if (!detailsId) {
      setSelectedPokemon(null);
    }
  }, [detailsId, results]);

  return (
    <div className={`cards-page theme-${theme}`}>
      <SearchBar onSearch={handleSearch} searchValue={searchQuery} />
      <RefreshButton onClick={handleRefetch} disabled={isLoading} />
      <div className="main">
        {isLoading && <Spinner />}
        {error && !isLoading && <ErrorMessage message={errorMessage} />}
        {!isLoading && !error && results.length > 0 && (
          <>
            {paginationData.totalPages > 1 && (
              <Pagination
                currentPage={paginationData.currentPage}
                totalPages={paginationData.totalPages}
                onPageChange={handlePageChange}
                hasNext={paginationData.hasNext}
                hasPrev={paginationData.hasPrev}
              />
            )}
            <TwoColumnLayout
              isDetailOpen={!!selectedPokemon}
              leftColumn={
                <CardList results={results} onCardClick={handleCardClick} />
              }
              rightColumn={
                selectedPokemon && (
                  <CardDetail
                    pokemon={selectedPokemon}
                    onClose={handleCloseDetail}
                  />
                )
              }
            />
          </>
        )}
        {!isLoading && !error && results.length === 0 && (
          <ErrorMessage message="No pokemons found" />
        )}
      </div>
    </div>
  );
};

export default CardsPage;
