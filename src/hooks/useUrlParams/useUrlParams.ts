import { useSearchParams } from 'react-router';
import { useCallback } from 'react';

export const useUrlParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const details = searchParams.get('details');

  const updatePage = useCallback(
    (newPage: number) => {
      const newParams = new URLSearchParams(searchParams);
      if (newPage === 1) {
        newParams.delete('page');
      } else {
        newParams.set('page', newPage.toString());
      }
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  const updateDetails = useCallback(
    (pokemonId: number | null) => {
      const newParams = new URLSearchParams(searchParams);
      if (pokemonId === null) {
        newParams.delete('details');
      } else {
        newParams.set('details', pokemonId.toString());
      }
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  const clearParams = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return {
    page,
    details: details ? parseInt(details, 10) : null,
    updatePage,
    updateDetails,
    clearParams,
  };
};
