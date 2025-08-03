import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchGithubUser } from './fetchGithubUser';
import { mockRawFetchGithubUserResponse } from '@mocks/github';

const createMockResponse = (responseInit: Partial<Response>): Response =>
  ({
    ok: true,
    ...responseInit,
  }) as Response;

describe('fetchGithubUser', () => {
  let mockFetch: ReturnType<typeof vi.mocked<typeof fetch>>;

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('fetch', vi.fn());
    mockFetch = vi.mocked(fetch);
  });

  it('fetches user data successfully', async () => {
    const mockResponse = createMockResponse({
      ok: true,
      json: () => Promise.resolve(mockRawFetchGithubUserResponse),
    });
    mockFetch.mockResolvedValue(mockResponse);

    const data = await fetchGithubUser('pelegrine365');
    expect(fetch).toHaveBeenCalledWith(
      'https://api.github.com/users/pelegrine365'
    );
    expect(data).toEqual(mockRawFetchGithubUserResponse);
  });

  it('throws error if response is not ok', async () => {
    const mockResponse = createMockResponse({ ok: false });
    mockFetch.mockResolvedValue(mockResponse);

    await expect(fetchGithubUser('baduser')).rejects.toThrow(
      'Failed to fetch github user'
    );
  });

  it('throws if fetch fails', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    await expect(fetchGithubUser('pelegrine365')).rejects.toThrow(
      'Network error'
    );
  });

  it('throws if response.json fails', async () => {
    const mockResponse = createMockResponse({
      ok: true,
      json: () => Promise.reject(new Error('Bad JSON')),
    });
    mockFetch.mockResolvedValue(mockResponse);

    await expect(fetchGithubUser('pelegrine365')).rejects.toThrow('Bad JSON');
  });
});
