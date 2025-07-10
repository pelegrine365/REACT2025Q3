import { Component } from 'react';
import { fetchPokemonByName } from '../api/fetchPokemonItemByName';

import SearchBar from '../components/SearchBar';
import './index.css';

interface ResultItem {
  name: string;
  image: string;
}

interface AppState {
  results: ResultItem[];
}

class App extends Component<unknown, AppState> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      results: [],
    };
  }

  handleSearch = async (inputValue: string) => {
    try {
      const result: ResultItem = await fetchPokemonByName(inputValue);
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
    return (
      <div className="app-container">
        <div className="header">
          <h1>Pokemons Cards</h1>
          <SearchBar onSearch={this.handleSearch} />
        </div>
        <div className="main"></div>
      </div>
    );
  }
}

export default App;
