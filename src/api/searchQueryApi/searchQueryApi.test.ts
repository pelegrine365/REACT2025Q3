import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  getSearchQuery,
  setSearchQuery,
  removeSearchQuery,
} from '@api/searchQueryApi';
import { SEARCH_VALUE_KEY } from '@constants';

describe('searchQueryApi', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns saved value from searchQueryApi', () => {
    const spy = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockReturnValue('MUDBRAY');

    const value = getSearchQuery();

    expect(spy).toHaveBeenCalledWith(SEARCH_VALUE_KEY);
    expect(value).toBe('MUDBRAY');
  });

  it('returns null if key does not exist in localStorage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    const value = getSearchQuery();

    expect(value).toBe(null);
  });

  it('throws if getItem throws error', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('getItem error');
    });

    expect(() => getSearchQuery()).toThrow('getItem error');
  });

  it('saves value to localStorage', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem');

    setSearchQuery('TOXAPEX');

    expect(spy).toHaveBeenCalledWith(SEARCH_VALUE_KEY, 'TOXAPEX');
  });

  it('throws if setItem throws error', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('setItem error');
    });

    expect(() => setSearchQuery('FOMANTIS')).toThrow('setItem error');
  });

  it('removes value from localStorage', () => {
    const spy = vi.spyOn(Storage.prototype, 'removeItem');

    removeSearchQuery();

    expect(spy).toHaveBeenCalledWith(SEARCH_VALUE_KEY);
  });

  it('throws if removeItem throws error', () => {
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('removeItem error');
    });

    expect(() => removeSearchQuery()).toThrow('removeItem error');
  });
});
