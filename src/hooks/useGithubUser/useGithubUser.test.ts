import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getGithubUser } from '@services/githubService/githubService';
import { useGithubUser } from '@hooks/useGithubUser';
import type { GithubUser } from '@types';

vi.mock('@services/githubService/githubService', () => ({
  getGithubUser: vi.fn(),
}));

const mockGetGithubUser = vi.mocked(getGithubUser);

describe('useGithubUser', () => {
  const mockGithubUser: GithubUser = {
    name: 'Test User',
    avatarURL: 'https://github.com/pelegrine365',
    userURL: 'https://github.com/pelegrine365',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial loading state', () => {
    const { result } = renderHook(() => useGithubUser(''));

    expect(result.current.avatarURL).toBe('');
    expect(result.current.userURL).toBe('');
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('should not fetch data when userName is empty', async () => {
    renderHook(() => useGithubUser(''));

    await waitFor(() => {
      expect(mockGetGithubUser).not.toHaveBeenCalled();
    });
  });

  it('should fetch and return user data successfully', async () => {
    mockGetGithubUser.mockResolvedValue(mockGithubUser);

    const { result } = renderHook(() => useGithubUser('testuser'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockGetGithubUser).toHaveBeenCalledWith('testuser');
    expect(result.current.avatarURL).toBe(mockGithubUser.avatarURL);
    expect(result.current.userURL).toBe(mockGithubUser.userURL);
    expect(result.current.error).toBe(null);
  });

  it('should handle error when fetch fails', async () => {
    const errorMessage = 'Failed to fetch github user';
    mockGetGithubUser.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useGithubUser('user_not_found'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.avatarURL).toBe('');
    expect(result.current.userURL).toBe('');
    expect(result.current.error).toBe(errorMessage);
  });

  it('should reset error state when new fetch starts', async () => {
    mockGetGithubUser
      .mockRejectedValueOnce(new Error('First error'))
      .mockResolvedValueOnce(mockGithubUser);

    const { result, rerender } = renderHook(
      ({ userName }) => useGithubUser(userName),
      { initialProps: { userName: 'erroruser' } }
    );

    await waitFor(() => {
      expect(result.current.error).toBe('First error');
    });

    rerender({ userName: 'successuser' });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(null);
    expect(result.current.avatarURL).toBe(mockGithubUser.avatarURL);
  });
});
