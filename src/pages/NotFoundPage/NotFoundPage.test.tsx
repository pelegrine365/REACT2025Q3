import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router';
import NotFoundPage from './NotFoundPage';

const mockNavigate = vi.fn();

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('NotFoundPage component', () => {
  it('renders 404 error page with correct content', () => {
    renderWithRouter(<NotFoundPage />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found!')).toBeInTheDocument();
    expect(screen.getByText('Go Back')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('calls navigate(-1) when back button is clicked', () => {
    renderWithRouter(<NotFoundPage />);

    const backButton = screen.getByText('Go Back');
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('calls navigate("/") when home button is clicked', () => {
    renderWithRouter(<NotFoundPage />);

    const homeButton = screen.getByText('Home');
    fireEvent.click(homeButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('applies correct CSS classes', () => {
    renderWithRouter(<NotFoundPage />);

    expect(screen.getByText('404').closest('.error-page')).toBeInTheDocument();
    expect(screen.getByText('404')).toHaveClass('error-title');
    expect(screen.getByText('Page Not Found!')).toHaveClass('error-heading');
    expect(screen.getByText('Go Back')).toHaveClass('button', 'button-yellow');
    expect(screen.getByText('Home')).toHaveClass('button', 'button-blue');
  });
});
