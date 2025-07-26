import { useState, useEffect } from 'react';

import { getPokemonsBySearch } from '@services/pokemonService';

import SearchBar from '@components/SearchBar';
import CardList from '@components/CardList';
import Spinner from '@components/Spinner';
import ErrorMessage from '@components/ErrorMessage';
import ErrorBoundary from '@components/ErrorBoundary';

import { useSearchQuery } from '@hooks/useSearchQuery';

import type { Pokemon } from '@types';

import './index.css';

const App = () => {
  const [results, setResults] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { searchQuery, updateSearchQuery } = useSearchQuery();

  const fetchAndSetPokemons = async (inputValue: string) => {
    setLoading(true);
    setHasError(false);

    try {
      const pokemons = await getPokemonsBySearch(inputValue);
      setResults(pokemons);
    } catch (error: unknown) {
      let message = 'Pokemon not found. Try searching with a different name.';
      if (error instanceof Error) {
        message = error.message;
      }
      setResults([]);
      setHasError(true);
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (inputValue: string) => {
    updateSearchQuery(inputValue);
  };

  useEffect(() => {
    fetchAndSetPokemons(searchQuery);
  }, [searchQuery]);

  return (
    <ErrorBoundary>
      <div className="app-container">
        <div className="header">
          <h1>Pokemons Cards</h1>
          <SearchBar onSearch={handleSearch} searchValue={searchQuery} />
        </div>
        <div className="main">
          {loading && !hasError && <Spinner />}
          {!loading && !hasError && <CardList results={results} />}
          {hasError && <ErrorMessage message={errorMessage} />}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;
