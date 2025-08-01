import { describe, it, expect } from 'vitest';
import { getVisiblePages } from './getVisiblePages';

describe('getVisiblePages', () => {
  it('returns 5 pages centered on currentPage when possible', () => {
    expect(getVisiblePages(3, 10)).toEqual([1, 2, 3, 4, 5]);
    expect(getVisiblePages(5, 10)).toEqual([3, 4, 5, 6, 7]);
    expect(getVisiblePages(8, 10)).toEqual([6, 7, 8, 9, 10]);
  });

  it('handles currentPage near the start', () => {
    expect(getVisiblePages(1, 10)).toEqual([1, 2, 3, 4, 5]);
    expect(getVisiblePages(2, 10)).toEqual([1, 2, 3, 4, 5]);
  });

  it('handles currentPage near the end', () => {
    expect(getVisiblePages(10, 10)).toEqual([6, 7, 8, 9, 10]);
    expect(getVisiblePages(9, 10)).toEqual([6, 7, 8, 9, 10]);
  });

  it('handles totalPage less than 5', () => {
    expect(getVisiblePages(2, 3)).toEqual([1, 2, 3]);
    expect(getVisiblePages(1, 1)).toEqual([1]);
  });

  it('handles currentPage out of range', () => {
    expect(getVisiblePages(-2, 3)).toEqual([1, 2, 3]);
    expect(getVisiblePages(100, 3)).toEqual([1, 2, 3]);
  });

  it('handles totalPages is 0 or negative', () => {
    expect(getVisiblePages(1, 0)).toEqual([]);
    expect(getVisiblePages(1, -5)).toEqual([]);
  });
});
