import { GITHUB_API_BASE_URL } from '@constants';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { GithubUser, GithubRawUser } from '@types';

export const githubApi = createApi({
  reducerPath: 'githubApi',
  baseQuery: fetchBaseQuery({
    baseUrl: GITHUB_API_BASE_URL,
  }),
  endpoints: (build) => ({
    getUser: build.query<GithubUser, string>({
      query: (username) => `users/${username}`,
      transformResponse: (data: GithubRawUser): GithubUser => ({
        name: data.name,
        avatarURL: data.avatar_url,
        userURL: data.html_url,
      }),
    }),
  }),
  keepUnusedDataFor: 86400,
});

export const { useGetUserQuery } = githubApi;
