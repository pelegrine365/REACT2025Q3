import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  getLocalStorageItem,
  setLocalStorageItem,
  removeLocalStorageItem,
} from '@api/searchStorage';
import { SEARCH_VALUE_KEY } from '@constants';

describe('searchStorage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns saved value from localStorage', () => {
    const spy = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockReturnValue('MUDBRAY');

    const value = getLocalStorageItem(SEARCH_VALUE_KEY);

    expect(spy).toHaveBeenCalledWith(SEARCH_VALUE_KEY);
    expect(value).toBe('MUDBRAY');
  });

  it('returns empty string if key does not exist in localStorage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    const value = getLocalStorageItem(SEARCH_VALUE_KEY);

    expect(value).toBe(null);
    expect(value).not.toBe('');
  });

  it('throws if getItem throws error', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('getItem error');
    });

    expect(() => getLocalStorageItem(SEARCH_VALUE_KEY)).toThrow(
      'getItem error'
    );
  });

  it('saves value to localStorage', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem');

    setLocalStorageItem(SEARCH_VALUE_KEY, 'TOXAPEX');

    expect(spy).toHaveBeenCalledWith(SEARCH_VALUE_KEY, 'TOXAPEX');
  });

  it('throws if setItem throws error', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('setItem error');
    });

    expect(() => setLocalStorageItem(SEARCH_VALUE_KEY, 'FOMANTIS')).toThrow(
      'setItem error'
    );
  });

  it('removes value from localStorage', () => {
    const spy = vi.spyOn(Storage.prototype, 'removeItem');

    removeLocalStorageItem(SEARCH_VALUE_KEY);

    expect(spy).toHaveBeenCalledWith(SEARCH_VALUE_KEY);
  });

  it('throws if removeItem throws error', () => {
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('removeItem error');
    });

    expect(() => removeLocalStorageItem(SEARCH_VALUE_KEY)).toThrow(
      'removeItem error'
    );
  });
});
