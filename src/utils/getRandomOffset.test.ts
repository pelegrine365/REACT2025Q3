import { describe, it, expect, vi } from 'vitest';
import { getRandomOffset } from './getRandomOffset';

describe('getRandomOffset', () => {
  it('returns a number from 0 to (totalCount - requestCount - 1)', () => {
    const totalCount = 100;
    const requestCount = 10;
    const offset = getRandomOffset(totalCount, requestCount);

    const maxOffset = totalCount - requestCount;
    expect(offset).toBeGreaterThanOrEqual(0);
    expect(offset).toBeLessThan(maxOffset);
  });

  it('returns 0 when totalCount === requestCount', () => {
    expect(getRandomOffset(50, 50)).toBe(0);
  });

  it('returns 0 when totalCount < requestCount', () => {
    expect(getRandomOffset(20, 30)).toBe(0);
  });

  it('returns 0 when totalCount <= 0', () => {
    expect(getRandomOffset(0, 10)).toBe(0);
    expect(getRandomOffset(-10, 5)).toBe(0);
  });

  it('throws when requestCount is 0 or less', () => {
    expect(() => getRandomOffset(100, 0)).toThrow();
    expect(() => getRandomOffset(100, -5)).toThrow();
  });

  it('calls Math.random and Math.floor with correct value', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const floorSpy = vi.spyOn(Math, 'floor');

    const total = 100;
    const request = 10;
    const expectedMaxOffset = total - request;

    const result = getRandomOffset(total, request);
    expect(result).toBe(Math.floor(0.5 * expectedMaxOffset));
    expect(randomSpy).toHaveBeenCalled();
    expect(floorSpy).toHaveBeenCalledWith(0.5 * expectedMaxOffset);
    expect(result).toBe(45);

    randomSpy.mockRestore();
    floorSpy.mockRestore();
  });
});
