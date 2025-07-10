import { Component } from 'react';
import './index.css';

interface SearchBarState {
  inputValue: string;
}

interface SearchBarProps {
  onSearch: (inputValue: string) => void;
}

class SearchBar extends Component<SearchBarProps, SearchBarState> {
  constructor(props: SearchBarProps) {
    super(props);
    this.state = { inputValue: '' };
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value });
  };

  handleClick = () => {
    this.props.onSearch(this.state.inputValue);
  };

  render() {
    return (
      <div className="search-bar-container">
        <div className="search-bar">
          <input
            type="text"
            value={this.state.inputValue}
            onChange={this.handleChange}
            placeholder="Write the request..."
          />
          <button onClick={this.handleClick}>Search</button>
        </div>
      </div>
    );
  }
}

export default SearchBar;
