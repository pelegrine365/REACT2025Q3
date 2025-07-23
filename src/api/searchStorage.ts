import { SEARCH_VALUE_KEY } from '../constants';

export function getSavedSearchValue(): string {
  return localStorage.getItem(SEARCH_VALUE_KEY) ?? '';
}

export function saveSearchValue(value: string): void {
  localStorage.setItem(SEARCH_VALUE_KEY, value);
}

export function clearSearchValue(): void {
  localStorage.removeItem(SEARCH_VALUE_KEY);
}
