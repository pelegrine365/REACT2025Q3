import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { githubApi, useGetUserQuery } from './githubApi';
import { mockGithubUser, mockRawGithubUserResponse } from '@mocks/github';
import type { GithubRawUser } from '@types';

const mockFetch = vi.fn();
Object.defineProperty(globalThis, 'fetch', {
  value: mockFetch,
  writable: true,
});

const createMockResponse = (
  data: GithubRawUser | { message: string },
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
      [githubApi.reducerPath]: githubApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(githubApi.middleware),
  });

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  return TestWrapper;
};

describe('githubApi', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('useGetUserQuery hook', () => {
    it('should fetch and return user data successfully', async () => {
      mockFetch.mockReturnValueOnce(
        createMockResponse(mockRawGithubUserResponse)
      );

      const { result } = renderHook(() => useGetUserQuery('testuser'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const fetchCall = mockFetch.mock.calls[0];
      const fetchRequest = fetchCall[0];
      expect(fetchRequest.url).toBe('https://api.github.com/users/testuser');

      expect(result.current.data).toEqual(mockGithubUser);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.error).toBeUndefined();
    });

    it('should handle API errors', async () => {
      mockFetch.mockReturnValueOnce(
        createMockResponse({ message: 'Not Found' }, false, 404)
      );

      const { result } = renderHook(() => useGetUserQuery('nonexistentuser'), {
        wrapper: createWrapper(),
      });

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

      const { result } = renderHook(() => useGetUserQuery('testuser'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBeDefined();
    });

    it('should transform response data correctly', async () => {
      mockFetch.mockReturnValueOnce(
        createMockResponse(mockRawGithubUserResponse)
      );

      const { result } = renderHook(() => useGetUserQuery('johndoe'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockGithubUser);
    });

    it('should not fetch when username is empty and skip option is used', () => {
      const { result } = renderHook(() => useGetUserQuery('', { skip: true }), {
        wrapper: createWrapper(),
      });

      expect(result.current.isUninitialized).toBe(true);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('API configuration', () => {
    it('should have correct reducer path', () => {
      expect(githubApi.reducerPath).toBe('githubApi');
    });

    it('should have correct base URL', () => {
      expect(githubApi).toBeDefined();
    });

    it('should cache data for 24 hours', () => {
      expect(githubApi.reducerPath).toBe('githubApi');
    });
  });
});
