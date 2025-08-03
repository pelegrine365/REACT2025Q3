import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUrlParams } from './useUrlParams';

const mockSetSearchParams = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useSearchParams: () => [
      new URLSearchParams('page=2&details=123'),
      mockSetSearchParams,
    ],
  };
});

describe('useUrlParams', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return current page and details from URL params', () => {
    const { result } = renderHook(() => useUrlParams());

    expect(result.current.page).toBe(2);
    expect(result.current.details).toBe(123);
  });

  it('should update page parameter', () => {
    const { result } = renderHook(() => useUrlParams());

    act(() => {
      result.current.updatePage(3);
    });

    expect(mockSetSearchParams).toHaveBeenCalled();
  });

  it('should remove page parameter when page is 1', () => {
    const { result } = renderHook(() => useUrlParams());

    act(() => {
      result.current.updatePage(1);
    });

    expect(mockSetSearchParams).toHaveBeenCalled();
  });

  it('should update details parameter', () => {
    const { result } = renderHook(() => useUrlParams());

    act(() => {
      result.current.updateDetails(456);
    });

    expect(mockSetSearchParams).toHaveBeenCalled();
  });

  it('should remove details parameter when passed null', () => {
    const { result } = renderHook(() => useUrlParams());

    act(() => {
      result.current.updateDetails(null);
    });

    expect(mockSetSearchParams).toHaveBeenCalled();
  });

  it('should clear all parameters', () => {
    const { result } = renderHook(() => useUrlParams());

    act(() => {
      result.current.clearParams();
    });

    expect(mockSetSearchParams).toHaveBeenCalledWith(new URLSearchParams());
  });
});
