import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { AUTHOR_GITHUB_NAME } from '@constants';
import { githubApi } from '@api/githubApi';
import type { GithubRawUser } from '@types';
import { mockRawGithubUserResponse } from '@mocks/github';

import AboutPage from './AboutPage';

const mockFetch = vi.fn();
Object.defineProperty(globalThis, 'fetch', {
  value: mockFetch,
  writable: true,
});

const createMockResponse = (
  data: GithubRawUser | { message: string },
  ok = true,
  status = 200
) => {
  const response = {
    ok,
    status,
    statusText: ok ? 'OK' : 'Error',
    headers: new Headers({ 'content-type': 'application/json' }),
    json: vi.fn().mockResolvedValue(data),
    text: vi.fn().mockResolvedValue(JSON.stringify(data)),
    clone: vi.fn().mockReturnValue({
      ok,
      status,
      statusText: ok ? 'OK' : 'Error',
      headers: new Headers({ 'content-type': 'application/json' }),
      json: vi.fn().mockResolvedValue(data),
      text: vi.fn().mockResolvedValue(JSON.stringify(data)),
    }),
  };
  return Promise.resolve(response as unknown as Response);
};

const createWrapper = () => {
  const store = configureStore({
    reducer: {
      [githubApi.reducerPath]: githubApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(githubApi.middleware),
  });

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  return TestWrapper;
};

describe('AboutPage', () => {
  const renderAboutPage = (
    mockResponse?: GithubRawUser | { message: string },
    shouldError = false
  ) => {
    if (shouldError) {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
    } else if (mockResponse !== undefined) {
      mockFetch.mockReturnValueOnce(createMockResponse(mockResponse));
    }

    const Wrapper = createWrapper();
    return render(<AboutPage />, { wrapper: Wrapper });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
    githubApi.util.resetApiState();
  });

  it('should show Spinner when loading', async () => {
    const pendingPromise = new Promise(() => {});
    mockFetch.mockReturnValueOnce(pendingPromise as unknown as Response);

    renderAboutPage();

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText(/created by:/i)).not.toBeInTheDocument();
  });

  it('should show Spinner when there is an error', async () => {
    renderAboutPage(undefined, true);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText(/created by:/i)).not.toBeInTheDocument();
  });

  it('should display author info with avatar and github link when data is loaded', async () => {
    renderAboutPage(mockRawGithubUserResponse);

    await screen.findByText(/created by:/i);

    expect(screen.getByText(/created by:/i)).toBeInTheDocument();
    expect(screen.getByText(AUTHOR_GITHUB_NAME)).toBeInTheDocument();

    const avatar = screen.getByAltText('avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', mockRawGithubUserResponse.avatar_url);

    const githubLink = screen.getByRole('link', {
      name: /view github profile/i,
    });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute(
      'href',
      mockRawGithubUserResponse.html_url
    );
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should render education section with RS School link', () => {
    renderAboutPage(mockRawGithubUserResponse);

    expect(
      screen.getByRole('heading', { name: /education/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /this project was developed as part of the rs school react course/i
      )
    ).toBeInTheDocument();

    const courseLink = screen.getByRole('link', {
      name: /rs school react course/i,
    });
    expect(courseLink).toBeInTheDocument();
    expect(courseLink).toHaveAttribute(
      'href',
      'https://rs.school/courses/reactjs'
    );
    expect(courseLink).toHaveAttribute('target', '_blank');
  });

  it('should render technologies section with all tech items', () => {
    renderAboutPage(mockRawGithubUserResponse);

    expect(
      screen.getByRole('heading', { name: /technologies used/i })
    ).toBeInTheDocument();

    expect(screen.getByText('React 19')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Vite')).toBeInTheDocument();
    expect(screen.getByText('React Router')).toBeInTheDocument();
    expect(screen.getByText('Vitest & Testing Library')).toBeInTheDocument();
    expect(screen.getByText('PokeAPI')).toBeInTheDocument();
  });

  it('should render features section with all feature items', () => {
    renderAboutPage(mockRawGithubUserResponse);

    expect(
      screen.getByRole('heading', { name: /features/i })
    ).toBeInTheDocument();

    expect(screen.getByText('Search Pokemon by name')).toBeInTheDocument();
    expect(screen.getByText('Responsive design')).toBeInTheDocument();
    expect(screen.getByText('Pokemon-themed styling')).toBeInTheDocument();
    expect(
      screen.getByText('Detailed Pokemon information')
    ).toBeInTheDocument();
    expect(screen.getByText('Fast and modern interface')).toBeInTheDocument();
    expect(screen.getByText('Comprehensive test coverage')).toBeInTheDocument();
  });

  it('should make API call to fetch user data', async () => {
    renderAboutPage(mockRawGithubUserResponse);

    await screen.findByText(/created by:/i);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        url: `https://api.github.com/users/${AUTHOR_GITHUB_NAME}`,
      })
    );
  });

  it('has correct CSS classes and structure', () => {
    renderAboutPage(mockRawGithubUserResponse);

    expect(document.querySelector('.about-page')).toBeInTheDocument();
    expect(document.querySelector('.about__container')).toBeInTheDocument();
    expect(document.querySelector('.about__content')).toBeInTheDocument();
  });
});
