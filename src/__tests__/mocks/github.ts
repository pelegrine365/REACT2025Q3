import { vi } from 'vitest';
import type { GithubUser } from '@types';

export const mockGithubUser: GithubUser = {
  name: 'Test User',
  avatarURL: 'avatar.png',
  userURL: 'profile.html',
};

export const mockRawGithubUserResponse = {
  name: 'Test User',
  avatar_url: 'avatar.png',
  html_url: 'profile.html',
};

export const mockRawFetchGithubUserResponse = {
  login: 'pelegrine365',
  id: 211368667,
};

export const getGithubUser = vi.fn();
