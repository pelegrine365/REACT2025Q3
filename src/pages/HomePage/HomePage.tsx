import { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { ThemeContext } from 'contexts';

import CardList from '@components/CardList';
import ErrorMessage from '@components/ErrorMessage';
import SearchBar from '@components/SearchBar';
import Spinner from '@components/Spinner';
import CardDetail from '@components/CardDetail';
import TwoColumnLayout from '@components/TwoColumnLayout';
import Pagination from '@components/Pagination';

import { useSearchQuery } from '@hooks/useSearchQuery';
import { getPokemonsPaginatedList } from '@services/pokemonService';

import type { BasePokemon, PaginatedPokemonListResponse } from '@types';

import './index.css';

const HomePage = () => {
  const { theme } = useContext(ThemeContext);
  const [paginationData, setPaginationData] =
    useState<PaginatedPokemonListResponse | null>(null);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
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
      setLoading(false);
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
    <div className={`home-page theme-${theme}`}>
      <div className="header">
        <h1>Pokemons Cards</h1>
      </div>

      <div className="search-bar-container">
        <SearchBar onSearch={handleSearch} searchValue={searchQuery} />
      </div>

      <div className="main">
        {loading && <Spinner />}

        {hasError && <ErrorMessage message={errorMessage} />}

        {!loading && !hasError && paginationData && (
          <>
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
            {paginationData.totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={paginationData.totalPages}
                onPageChange={handlePageChange}
                hasNext={paginationData.hasNext}
                hasPrev={paginationData.hasPrev}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
