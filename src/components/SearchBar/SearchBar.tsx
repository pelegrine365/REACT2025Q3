import { useState } from 'react';
import { getSearchQuery } from '@api/searchQueryApi';

import './index.css';

interface SearchBarProps {
  searchValue: string;
  onSearch: (inputValue: string) => void;
}

const SearchBar = ({ searchValue, onSearch }: SearchBarProps) => {
  const [inputValue, setInputValue] = useState(searchValue);

  const handleClick = () => {
    const savedValue = getSearchQuery();
    if (savedValue === inputValue) {
      return;
    }
    onSearch(inputValue.trim());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };

  const handleClear = () => {
    setInputValue('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        name="search-name"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Write the request..."
      />
      <button onClick={handleClick}>Search</button>
      {inputValue && (
        <button className="clear" onClick={handleClear}>
          ×
        </button>
      )}
    </div>
  );
};

export default SearchBar;
