export const fetchGithubUser = async (name: string) => {
  const response = await fetch(`https://api.github.com/users/${name}`);
  if (!response.ok) {
    throw new Error('Failed to fetch github user');
  }

  return response.json();
};
