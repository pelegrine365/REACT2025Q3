import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSearchQuery } from './useSearchQuery';
import * as searchQueryApi from '@api/searchQueryApi';

vi.mock('@api/searchQueryApi', () => ({
  getSearchQuery: vi.fn(),
  setSearchQuery: vi.fn(),
  removeSearchQuery: vi.fn(),
}));

describe('useSearchQuery hook', () => {
  const mockGetSearchQuery = vi.mocked(searchQueryApi.getSearchQuery);
  const mockSetSearchQuery = vi.mocked(searchQueryApi.setSearchQuery);
  const mockRemoveSearchQuery = vi.mocked(searchQueryApi.removeSearchQuery);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial state', () => {
    it('should initialize with value from getSearchQuery when value exists', () => {
      mockGetSearchQuery.mockReturnValue('pikachu');

      const { result } = renderHook(() => useSearchQuery());

      expect(result.current.searchQuery).toBe('pikachu');
      expect(mockGetSearchQuery).toHaveBeenCalledOnce();
    });

    it('should initialize with empty string when getSearchQuery returns undefined', () => {
      mockGetSearchQuery.mockReturnValue('');

      const { result } = renderHook(() => useSearchQuery());

      expect(result.current.searchQuery).toBe('');
      expect(mockGetSearchQuery).toHaveBeenCalledOnce();
    });
  });

  describe('updateSearchQuery function', () => {
    it('should update search query and save to storage when query is not empty', () => {
      mockGetSearchQuery.mockReturnValue('');

      const { result } = renderHook(() => useSearchQuery());

      act(() => {
        result.current.updateSearchQuery('bulbasaur');
      });

      expect(result.current.searchQuery).toBe('bulbasaur');
      expect(mockSetSearchQuery).toHaveBeenCalledWith('bulbasaur');
      expect(mockSetSearchQuery).toHaveBeenCalledOnce();
      expect(mockRemoveSearchQuery).not.toHaveBeenCalled();
    });

    it('should update search query and remove from storage when query is empty string', () => {
      mockGetSearchQuery.mockReturnValue('pikachu');

      const { result } = renderHook(() => useSearchQuery());

      act(() => {
        result.current.updateSearchQuery('');
      });

      expect(result.current.searchQuery).toBe('');
      expect(mockRemoveSearchQuery).toHaveBeenCalledOnce();
      expect(mockSetSearchQuery).not.toHaveBeenCalled();
    });

    it('should handle multiple updates correctly', () => {
      mockGetSearchQuery.mockReturnValue('');

      const { result } = renderHook(() => useSearchQuery());

      act(() => {
        result.current.updateSearchQuery('pokemon1');
      });

      expect(result.current.searchQuery).toBe('pokemon1');
      expect(mockSetSearchQuery).toHaveBeenCalledWith('pokemon1');

      act(() => {
        result.current.updateSearchQuery('pokemon2');
      });

      expect(result.current.searchQuery).toBe('pokemon2');
      expect(mockSetSearchQuery).toHaveBeenCalledWith('pokemon2');

      act(() => {
        result.current.updateSearchQuery('');
      });

      expect(result.current.searchQuery).toBe('');
      expect(mockRemoveSearchQuery).toHaveBeenCalledOnce();

      expect(mockSetSearchQuery).toHaveBeenCalledTimes(2);
    });

    it('should handle whitespace-only query as empty', () => {
      mockGetSearchQuery.mockReturnValue('');

      const { result } = renderHook(() => useSearchQuery());

      act(() => {
        result.current.updateSearchQuery('   ');
      });

      expect(result.current.searchQuery).toBe('   ');
      expect(mockSetSearchQuery).toHaveBeenCalledWith('   ');
      expect(mockRemoveSearchQuery).not.toHaveBeenCalled();
    });

    it('should handle special characters in query', () => {
      mockGetSearchQuery.mockReturnValue('');

      const { result } = renderHook(() => useSearchQuery());

      const specialQuery = 'pokémon #123 @test!';

      act(() => {
        result.current.updateSearchQuery(specialQuery);
      });

      expect(result.current.searchQuery).toBe(specialQuery);
      expect(mockSetSearchQuery).toHaveBeenCalledWith(specialQuery);
    });
  });
});
