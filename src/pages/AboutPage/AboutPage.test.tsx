import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AUTHOR_GITHUB_NAME } from '@constants';
import { useGithubUser } from '@hooks/useGithubUser';

import AboutPage from './AboutPage';

vi.mock('@hooks/useGithubUser');
describe('AboutPage', () => {
  const mockUseGithubUser = vi.mocked(useGithubUser);

  const MOCK_AVATAR_URL = 'https://test.com/avatar';
  const MOCK_USER_URL = 'https://test.com/user';
  const MOCK_AUTHOR_AVATAR_URL =
    'https://avatars.githubusercontent.com/u/pelegrine365';
  const MOCK_AUTHOR_USER_URL = 'https://github.com/pelegrine365';

  const renderAboutPage = (
    mockData: Partial<ReturnType<typeof useGithubUser>> = {}
  ) => {
    const defaultMockData = {
      avatarURL: MOCK_AVATAR_URL,
      userURL: MOCK_USER_URL,
      loading: false,
      error: null,
      ...mockData,
    };

    mockUseGithubUser.mockReturnValue(defaultMockData);
    return render(<AboutPage />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render app description and main heading', () => {
    renderAboutPage({
      avatarURL: MOCK_AUTHOR_AVATAR_URL,
      userURL: MOCK_AUTHOR_USER_URL,
    });

    expect(
      screen.getByRole('heading', { name: /about pokemon cards/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /this pokemon cards application is a modern react application/i
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/built with typescript/i)).toBeInTheDocument();
  });

  it('should show Spinner when loading', () => {
    renderAboutPage({
      avatarURL: '',
      userURL: '',
      loading: true,
    });

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText(/created by:/i)).not.toBeInTheDocument();
  });

  it('should show Spinner when there is an error', () => {
    renderAboutPage({
      avatarURL: '',
      userURL: '',
      error: 'API Error',
    });

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText(/created by:/i)).not.toBeInTheDocument();
  });

  it('should display author info with avatar and github link when data is loaded', () => {
    renderAboutPage({
      avatarURL: MOCK_AUTHOR_AVATAR_URL,
      userURL: MOCK_AUTHOR_USER_URL,
    });

    expect(screen.getByText(/created by:/i)).toBeInTheDocument();
    expect(screen.getByText(AUTHOR_GITHUB_NAME)).toBeInTheDocument();

    const avatar = screen.getByAltText('avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', MOCK_AUTHOR_AVATAR_URL);

    const githubLink = screen.getByRole('link', {
      name: /view github profile/i,
    });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', MOCK_AUTHOR_USER_URL);
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should render education section with RS School link', () => {
    renderAboutPage();

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
    renderAboutPage();

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
    renderAboutPage();

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

  it('calls useGithubUser hook with correct author name', () => {
    renderAboutPage();

    expect(mockUseGithubUser).toHaveBeenCalledWith(AUTHOR_GITHUB_NAME);
    expect(mockUseGithubUser).toHaveBeenCalledTimes(1);
  });

  it('has correct CSS classes and structure', () => {
    renderAboutPage();

    expect(document.querySelector('.about-page')).toBeInTheDocument();
    expect(document.querySelector('.about__container')).toBeInTheDocument();
    expect(document.querySelector('.header')).toBeInTheDocument();
    expect(document.querySelector('.about__content')).toBeInTheDocument();
  });
});
