import CardList from '@components/CardList';
import ErrorMessage from '@components/ErrorMessage';
import SearchBar from '@components/SearchBar';
import Spinner from '@components/Spinner';
import { useSearchQuery } from '@hooks/useSearchQuery';
import { getPokemonsBySearch } from '@services/pokemonService';
import type { BasePokemon } from '@types';
import { useEffect, useState } from 'react';
import './index.css';

const HomePage = () => {
  const [results, setResults] = useState<Partial<BasePokemon>[]>([]);
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
    <div className="home-page">
      <div className="header">
        <h1>Pokemons Cards</h1>
      </div>
      <div className="search-bar-container">
        <SearchBar onSearch={handleSearch} searchValue={searchQuery} />
      </div>
      <div className="main">
        {loading && !hasError && <Spinner />}
        {!loading && !hasError && <CardList results={results} />}
        {hasError && <ErrorMessage message={errorMessage} />}
      </div>
    </div>
  );
};

export default HomePage;
