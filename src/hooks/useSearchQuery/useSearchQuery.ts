import { useState } from 'react';
import {
  getSearchQuery,
  setSearchQuery as saveToStorage,
  removeSearchQuery,
} from '@api/searchQueryApi';

export const useSearchQuery = () => {
  const [searchQuery, setSearchQuery] = useState<string>(
    () => getSearchQuery() || ''
  );

  const updateSearchQuery = (query: string) => {
    setSearchQuery(query);
    if (query) {
      saveToStorage(query);
    } else {
      removeSearchQuery();
    }
  };

  return {
    searchQuery,
    updateSearchQuery,
  };
};
