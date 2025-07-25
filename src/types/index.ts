export interface Pokemon {
  id: number;
  name: string;
  image: string;
  description: string;
  types: string[];
}

export interface GithubUser {
  name: string;
  avatarURL: string;
  userURL: string;
}
