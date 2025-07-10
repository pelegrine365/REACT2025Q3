import { Component } from 'react';

import SearchBar from '../components/SearchBar';
import './index.css';

interface AppState {
  inputValue: string;
  results: [];
}

class App extends Component<unknown, AppState> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      inputValue: '',
      results: [],
    };
  }

  handleSearch = (inputValue: string): void => {
    console.log(inputValue);
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
