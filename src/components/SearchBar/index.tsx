import { Component } from 'react';
import './index.css';

interface SearchBarState {
  inputValue: string;
}

interface SearchBarProps {
  searchValue: string;
  onSearch: (inputValue: string) => void;
}

class SearchBar extends Component<SearchBarProps, SearchBarState> {
  constructor(props: SearchBarProps) {
    super(props);
    this.state = { inputValue: this.props.searchValue };
  }

  handleClick = () => {
    this.props.onSearch(this.state.inputValue);
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value });
  };

  handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.handleClick();
    }
  };

  handleClear = () => {
    this.setState({ inputValue: '' });
    this.props.onSearch('');
  };

  render() {
    return (
      <div className="search-bar-container">
        <div className="search-bar">
          <input
            type="text"
            name="search-name"
            value={this.state.inputValue}
            onChange={this.handleChange}
            placeholder="Write the request..."
          />
          <button onClick={this.handleClick} disabled={!this.state.inputValue}>
            Search
          </button>
          <button
            className="clear"
            onClick={this.handleClear}
            disabled={!this.state.inputValue}
          >
            x
          </button>
        </div>
      </div>
    );
  }
}

export default SearchBar;
