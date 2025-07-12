import { Component } from 'react';
import { fetchPokemonByName } from '../api/fetchPokemonItemByName';

import SearchBar from '../components/SearchBar';
import CardList from '../components/CardList';
import Spinner from '../components/Spinner';

import type { Pokemon } from '../types';

import './index.css';

interface AppState {
  results: Pokemon[];
  loading: boolean;
}

class App extends Component<unknown, AppState> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      results: [] as Pokemon[],
      loading: false,
    };
  }

  handleSearch = async (inputValue: string) => {
    this.setState((prevState) => ({ ...prevState, loading: true }));

    try {
      const result: Pokemon = await fetchPokemonByName(inputValue);

      this.setState({
        results: [result],
      });
    } catch (error) {
      console.log(error);
      this.setState({
        results: [],
      });
    } finally {
      this.setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  render() {
    console.log('render', this.state.results);
    return (
      <div className="app-container">
        <div className="header">
          <h1>Pokemons Cards</h1>
          <SearchBar onSearch={this.handleSearch} />
        </div>
        <div className="main">
          {this.state.loading && <Spinner />}
          {!this.state.loading && (
            <CardList results={this.state.results}></CardList>
          )}
        </div>
      </div>
    );
  }
}

export default App;
