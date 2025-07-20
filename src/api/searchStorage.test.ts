import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  getSavedSearchValue,
  saveSearchValue,
  clearSearchValue,
} from './searchStorage';
import { SEARCH_VALUE_KEY } from '../constants';

describe('searchStorage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns saved value from localStorage', () => {
    const spy = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockReturnValue('MUDBRAY');

    const value = getSavedSearchValue();

    expect(spy).toHaveBeenCalledWith(SEARCH_VALUE_KEY);
    expect(value).toBe('MUDBRAY');
  });

  it('returns empty string if key does not exist in localStorage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    const value = getSavedSearchValue();

    expect(value).toBe('');
    expect(value).not.toBe(null);
  });

  it('throws if getItem throws error', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('getItem error');
    });

    expect(() => getSavedSearchValue()).toThrow('getItem error');
  });

  it('saves value to localStorage', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem');

    saveSearchValue('TOXAPEX');

    expect(spy).toHaveBeenCalledWith(SEARCH_VALUE_KEY, 'TOXAPEX');
  });

  it('throws if setItem throws error', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('setItem error');
    });

    expect(() => saveSearchValue('FOMANTIS')).toThrow('setItem error');
  });

  it('removes value from localStorage', () => {
    const spy = vi.spyOn(Storage.prototype, 'removeItem');

    clearSearchValue();

    expect(spy).toHaveBeenCalledWith(SEARCH_VALUE_KEY);
  });

  it('throws if removeItem throws error', () => {
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('removeItem error');
    });

    expect(() => clearSearchValue()).toThrow('removeItem error');
  });
});
