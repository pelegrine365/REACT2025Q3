import { useState, useEffect } from 'react';
import { getGithubUser } from '@services/githubService/githubService';
import type { GithubUser } from '@types';

export const useGithubUser = (userName: string) => {
  const [avatarURL, setAvatarURL] = useState('');
  const [userURL, setUserURL] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userName) return;
    let canceled = false;

    const fetchData = async (name: string) => {
      setLoading(true);
      setError(null);
      try {
        const data: GithubUser = await getGithubUser(name);
        if (!canceled) {
          setAvatarURL(data.avatarURL);
          setUserURL(data.userURL);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));
      } finally {
        setLoading(false);
      }
    };

    fetchData(userName);

    return () => {
      canceled = true;
    };
  }, [userName]);

  return { avatarURL, userURL, loading, error };
};
