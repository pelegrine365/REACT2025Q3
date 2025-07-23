import { Component } from 'react';
import './index.css';
import { getSavedSearchValue } from '../../api/searchStorage';

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
    const savedValue = getSavedSearchValue();
    if (savedValue === this.state.inputValue) {
      return;
    }
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
    const { inputValue } = this.state;
    return (
      <div className="search-bar-container">
        <div className="search-bar">
          <input
            type="text"
            name="search-name"
            value={inputValue}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            placeholder="Write the request..."
          />
          <button onClick={this.handleClick} disabled={!inputValue}>
            Search
          </button>
          {inputValue && (
            <button className="clear" onClick={this.handleClear}>
              ×
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default SearchBar;
