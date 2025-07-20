import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';
import BrokenComponent from '../BrokenComponent';

describe('BrokenComponent', () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  it('triggers error boundary fallback UI', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Ooooops...')).toBeInTheDocument();
    expect(screen.getByText('Go to home page')).toBeInTheDocument();
  });

  it('logs error to console.error', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalled();
    const [, error] = errorSpy.mock.calls[0];
    expect(error).toBeInstanceOf(Error);
  });
});
