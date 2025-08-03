import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import CardList from '@components/CardList';
import ErrorMessage from '@components/ErrorMessage';
import SearchBar from '@components/SearchBar';
import Spinner from '@components/Spinner';
import CardDetail from '@components/CardDetail';
import TwoColumnLayout from '@components/TwoColumnLayout';
import Pagination from '@components/Pagination';

import { useSearchQuery } from '@hooks/useSearchQuery';
import { useTheme } from '@hooks/useTheme';
import { getPokemonsPaginatedList } from '@services/pokemonService';

import type { BasePokemon, PaginatedPokemonListResponse } from '@types';

import './index.css';

const CardsPage = () => {
  const { theme } = useTheme();
  const [paginationData, setPaginationData] =
    useState<PaginatedPokemonListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState<BasePokemon | null>(
    null
  );

  const { searchQuery, updateSearchQuery } = useSearchQuery();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const detailsId = searchParams.get('details');

  const fetchPokemons = async (query: string, page: number) => {
    setIsLoading(true);
    setHasError(false);

    try {
      const data = await getPokemonsPaginatedList(page, query);
      setPaginationData(data);
    } catch (error) {
      setHasError(true);
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong'
      );
      setPaginationData(null);
    } finally {
      setIsLoading(false);
    }
  };

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
    const pokemon = paginationData?.results.find((p) => p.id === pokemonId);
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

  useEffect(() => {
    fetchPokemons(searchQuery, currentPage);
  }, [searchQuery, currentPage]);

  useEffect(() => {
    if (detailsId && paginationData) {
      const pokemon = paginationData.results.find(
        (p) => p.id === parseInt(detailsId, 10)
      );
      setSelectedPokemon(pokemon || null);
    } else {
      setSelectedPokemon(null);
    }
  }, [detailsId, paginationData]);

  return (
    <div className={`cards-page theme-${theme}`}>
      <SearchBar onSearch={handleSearch} searchValue={searchQuery} />
      <div className="main">
        {isLoading && <Spinner />}
        {hasError && <ErrorMessage message={errorMessage} />}
        {!isLoading && !hasError && paginationData && (
          <>
            {paginationData.totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={paginationData.totalPages}
                onPageChange={handlePageChange}
                hasNext={paginationData.hasNext}
                hasPrev={paginationData.hasPrev}
              />
            )}
            <TwoColumnLayout
              isDetailOpen={!!selectedPokemon}
              leftColumn={
                <CardList
                  results={paginationData.results}
                  onCardClick={handleCardClick}
                />
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
      </div>
    </div>
  );
};

export default CardsPage;
