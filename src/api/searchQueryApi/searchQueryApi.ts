import { SEARCH_VALUE_KEY } from '@constants';

export function getSearchQuery(): string | null {
  return localStorage.getItem(SEARCH_VALUE_KEY);
}

export function setSearchQuery(value: string): void {
  localStorage.setItem(SEARCH_VALUE_KEY, value);
}

export function removeSearchQuery(): void {
  localStorage.removeItem(SEARCH_VALUE_KEY);
}
