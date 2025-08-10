import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { pokemonApi, useGetPokemonSpeciesQuery } from './pokemonApi';
import {
  mockPokemonSpecies,
  createSpeciesApiResponse,
  mockBulbasaurSpeciesApiResponse,
} from '@mocks/pokemon';

const mockFetch = vi.fn();
Object.defineProperty(globalThis, 'fetch', {
  value: mockFetch,
  writable: true,
});

const createMockResponse = (
  data: unknown | { message: string },
  ok = true,
  status = 200
) => {
  const jsonMock = vi.fn().mockResolvedValue(data);
  const response = {
    ok,
    status,
    statusText: ok ? 'OK' : 'Error',
    headers: new Headers({ 'content-type': 'application/json' }),
    json: jsonMock,
    text: vi.fn().mockResolvedValue(JSON.stringify(data)),
    clone: vi.fn().mockReturnValue({
      ok,
      status,
      statusText: ok ? 'OK' : 'Error',
      headers: new Headers({ 'content-type': 'application/json' }),
      json: vi.fn().mockResolvedValue(data),
      text: vi.fn().mockResolvedValue(JSON.stringify(data)),
    }),
  };
  return Promise.resolve(response as unknown as Response);
};

const createWrapper = () => {
  const store = configureStore({
    reducer: {
      [pokemonApi.reducerPath]: pokemonApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pokemonApi.middleware),
  });

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  return TestWrapper;
};

const mockBulbasaurApiResponse = createSpeciesApiResponse({
  ...mockBulbasaurSpeciesApiResponse,
  is_legendary: false,
  flavor_text_entries: [
    {
      flavor_text: 'A strange seed was\nplanted on its back\nat birth.',
      language: { name: 'en' },
    },
  ],
});

describe('pokemonApi', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('useGetPokemonSpeciesQuery hook', () => {
    it('should fetch and return pokemon species data successfully', async () => {
      mockFetch.mockReturnValueOnce(
        createMockResponse(mockBulbasaurApiResponse)
      );

      const { result } = renderHook(
        () => useGetPokemonSpeciesQuery('bulbasaur'),
        {
          wrapper: createWrapper(),
        }
      );

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const fetchCall = mockFetch.mock.calls[0];
      const fetchRequest = fetchCall[0];
      expect(fetchRequest.url).toBe(
        'https://pokeapi.co/api/v2/pokemon-species/bulbasaur'
      );

      expect(result.current.data).toEqual(mockPokemonSpecies);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.error).toBeUndefined();
    });

    it('should handle API errors', async () => {
      mockFetch.mockReturnValueOnce(
        createMockResponse({ message: 'Not Found' }, false, 404)
      );

      const { result } = renderHook(
        () => useGetPokemonSpeciesQuery('nonexistent'),
        {
          wrapper: createWrapper(),
        }
      );

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBeDefined();
      expect(result.current.data).toBeUndefined();
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(
        () => useGetPokemonSpeciesQuery('bulbasaur'),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBeDefined();
    });

    it('should transform response data correctly', async () => {
      mockFetch.mockReturnValueOnce(
        createMockResponse(mockBulbasaurApiResponse)
      );

      const { result } = renderHook(
        () => useGetPokemonSpeciesQuery('bulbasaur'),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockPokemonSpecies);
    });

    it('should convert pokemon name to lowercase in URL', async () => {
      mockFetch.mockReturnValueOnce(
        createMockResponse(mockBulbasaurApiResponse)
      );

      const { result } = renderHook(
        () => useGetPokemonSpeciesQuery('BULBASAUR'),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const fetchCall = mockFetch.mock.calls[0];
      const fetchRequest = fetchCall[0];
      expect(fetchRequest.url).toBe(
        'https://pokeapi.co/api/v2/pokemon-species/bulbasaur'
      );
    });

    it('should handle missing optional fields gracefully', async () => {
      const mockResponseWithMissingFields = createSpeciesApiResponse({
        id: 2,
        name: 'ivysaur',
        color: { name: '' },
        shape: { name: '' },
        generation: { name: '' },
        is_legendary: false,
        is_mythical: false,
        flavor_text_entries: [],
        genera: [],
      });

      mockFetch.mockReturnValueOnce(
        createMockResponse(mockResponseWithMissingFields)
      );

      const { result } = renderHook(
        () => useGetPokemonSpeciesQuery('ivysaur'),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual({
        id: 2,
        name: 'ivysaur',
        color: '',
        shape: '',
        generation: '',
        isLegendary: false,
        isMythical: false,
        description: '',
        genus: '',
      });
    });

    it('should clean description text correctly', async () => {
      const mockResponseWithDirtyText = createSpeciesApiResponse({
        ...mockBulbasaurApiResponse,
        flavor_text_entries: [
          {
            flavor_text: 'Text with\nnewlines\fand form feeds  ',
            language: { name: 'en' },
          },
        ],
      });

      mockFetch.mockReturnValueOnce(
        createMockResponse(mockResponseWithDirtyText)
      );

      const { result } = renderHook(
        () => useGetPokemonSpeciesQuery('bulbasaur'),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data?.description).toBe(
        'Text with newlines and form feeds'
      );
    });

    it('should not fetch when pokemon name is empty and skip option is used', () => {
      const { result } = renderHook(
        () => useGetPokemonSpeciesQuery('', { skip: true }),
        {
          wrapper: createWrapper(),
        }
      );

      expect(result.current.isUninitialized).toBe(true);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('API configuration', () => {
    it('should have correct reducer path', () => {
      expect(pokemonApi.reducerPath).toBe('pokemonApi');
    });

    it('should have correct base URL', () => {
      expect(pokemonApi).toBeDefined();
    });

    it('should have getPokemonSpecies endpoint', () => {
      expect(pokemonApi.endpoints.getPokemonSpecies).toBeDefined();
      expect(typeof pokemonApi.endpoints.getPokemonSpecies.useQuery).toBe(
        'function'
      );
    });
  });
});
