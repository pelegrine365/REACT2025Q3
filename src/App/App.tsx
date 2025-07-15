import { Component } from 'react';

import { getPokemonsBySearch } from '../services/pokemonService';
import {
  clearSearchValue,
  getSavedSearchValue,
  saveSearchValue,
} from '../api/searchStorage';

import SearchBar from '../components/SearchBar';
import CardList from '../components/CardList';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import ErrorBoundary from '../components/ErrorBoundary';
import BrokenComponent from '../components/BrokenComponent';

import type { Pokemon } from '../types';

import './index.css';

interface AppState {
  results: Pokemon[];
  loading: boolean;
  initialSearchValue: string;
  hasError: boolean;
  errorMessage: string;
  showBrokenComponent: boolean;
}

class App extends Component<unknown, AppState> {
  constructor(props: unknown) {
    super(props);

    const savedSearchValue = localStorage.getItem('searchValue') ?? '';

    this.state = {
      results: [] as Pokemon[],
      loading: false,
      initialSearchValue: savedSearchValue,
      hasError: false,
      errorMessage: '',
      showBrokenComponent: false,
    };
  }

  async componentDidMount() {
    const savedSearchValue = getSavedSearchValue();
    this.fetchAndSetPokemons(savedSearchValue);
  }

  private fetchAndSetPokemons = async (inputValue: string) => {
    this.setState({ loading: true, hasError: false });
    if (inputValue) {
      saveSearchValue(inputValue);
    } else {
      clearSearchValue();
    }
    try {
      const pokemons = await getPokemonsBySearch(inputValue);
      this.setState({
        results: pokemons,
        hasError: false,
        errorMessage: '',
      });
    } catch (error: unknown) {
      let message = 'Pokemon not found. Try searching with a different name.';
      if (error instanceof Error) {
        message = error.message;
      }
      this.setState({
        results: [],
        hasError: true,
        errorMessage: message,
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleSearch = async (inputValue: string) => {
    this.setState({ initialSearchValue: inputValue });
    this.fetchAndSetPokemons(inputValue);
  };

  showBrokenComponent = () => {
    this.setState({ showBrokenComponent: true });
  };

  render() {
    return (
      <ErrorBoundary>
        <div className="app-container">
          <div className="header">
            <h1>Pokemons Cards</h1>
            <SearchBar
              onSearch={this.handleSearch}
              searchValue={this.state.initialSearchValue}
            />
          </div>
          <div className="main">
            {this.state.loading && !this.state.hasError && <Spinner />}
            {!this.state.loading && !this.state.hasError && (
              <CardList results={this.state.results}></CardList>
            )}
            {this.state.hasError && (
              <ErrorMessage message={this.state.errorMessage} />
            )}
            {this.state.showBrokenComponent && <BrokenComponent />}
          </div>
          <button className="error-button" onClick={this.showBrokenComponent}>
            Try error
          </button>
        </div>
      </ErrorBoundary>
    );
  }
}

export default App;
