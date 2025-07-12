import { Component } from 'react';
import { fetchPokemonByName } from '../api/fetchPokemonItemByName';

import SearchBar from '../components/SearchBar';
import CardList from '../components/CardList';
import './index.css';
import type { Pokemon } from '../types';

interface AppState {
  results: Pokemon[];
}

class App extends Component<unknown, AppState> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      results: [] as Pokemon[],
    };
  }
  handleSearch = async (inputValue: string) => {
    console.log('handleSearch', this.state.results);

    try {
      const result: Pokemon = await fetchPokemonByName(inputValue);
      this.setState({
        results: [result],
      });
    } catch (error) {
      console.error('Error:', error);
      this.setState({
        results: [],
      });
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
          <CardList results={this.state.results}></CardList>
        </div>
      </div>
    );
  }
}

export default App;
