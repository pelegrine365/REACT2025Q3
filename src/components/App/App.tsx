import { useState, useEffect } from 'react';

import { getPokemonsBySearch } from '../../services/pokemonService';
import {
  clearSearchValue,
  getSavedSearchValue,
  saveSearchValue,
} from '../../api/searchStorage';

import SearchBar from '../SearchBar/SearchBar';
import CardList from '../CardList/CardList';
import Spinner from '../Spinner/Spinner';
import ErrorMessage from '../ErrorMessage';
import ErrorBoundary from '../ErrorBoundary';
import BrokenComponent from '../BrokenComponent';

import type { Pokemon } from '../../types';

import './index.css';


const App = () => {
  const [results, setResults] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialSearchValue, setInitialSearchValue] = useState(() => getSavedSearchValue());
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showBrokenComponent, setShowBrokenComponent] = useState(false);

  const fetchAndSetPokemons = async (inputValue: string) => {
    setLoading(true);
    setHasError(false);

    if (inputValue) {
      saveSearchValue(inputValue);
    } else {
      clearSearchValue();
    }

    try {
      const pokemons = await getPokemonsBySearch(inputValue);
      setResults(pokemons);
      setHasError(false);
      setErrorMessage('');
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
    setInitialSearchValue(inputValue);
    fetchAndSetPokemons(inputValue);
  };

  const handleShowBrokenComponent = () => {
    setShowBrokenComponent(true);
  };

  useEffect(() => {
    const savedSearchValue = getSavedSearchValue();
    fetchAndSetPokemons(savedSearchValue);
  }, []);

  return (
    <ErrorBoundary>
      <div className="app-container">
        <div className="header">
          <h1>Pokemons Cards</h1>
          <SearchBar
            onSearch={handleSearch}
            searchValue={initialSearchValue}
          />
        </div>
        <div className="main">
          {loading && !hasError && <Spinner />}
          {!loading && !hasError && (
            <CardList results={results} />
          )}
          {hasError && (
            <ErrorMessage message={errorMessage} />
          )}
          {showBrokenComponent && <BrokenComponent />}
        </div>
        <button className="error-button" onClick={handleShowBrokenComponent}>
          Try error
        </button>
      </div>
    </ErrorBoundary>
  );
};


export default App;
