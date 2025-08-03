import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getGithubUser } from './githubService';
import { fetchGithubUser } from '@api/fetchGithubUser';
import { mockRawGithubUserResponse, mockGithubUser } from '@mocks/github';

vi.mock('@api/fetchGithubUser', () => ({
  fetchGithubUser: vi.fn(),
}));

const mockFetchGithubUser = vi.mocked(fetchGithubUser);

describe('getGithubUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns mapped github user', async () => {
    mockFetchGithubUser.mockResolvedValue(mockRawGithubUserResponse);
    const user = await getGithubUser('test');
    expect(fetchGithubUser).toHaveBeenCalledWith('test');
    expect(user).toEqual(mockGithubUser);
  });

  it('throws if fetchGithubUser fails', async () => {
    mockFetchGithubUser.mockRejectedValue(new Error('fail'));
    await expect(getGithubUser('test')).rejects.toThrow('fail');
  });
});
