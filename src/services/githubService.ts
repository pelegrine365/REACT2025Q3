import { fetchGithubUser } from '../api/fetchGithubUser';
import type { GithubUser } from '../types';

export async function getGithubUser(name: string): Promise<GithubUser> {
  const data = await fetchGithubUser(name);

  return {
    name: data.name,
    avatarURL: data.avatar_url,
    userURL: data.url,
  };
}
