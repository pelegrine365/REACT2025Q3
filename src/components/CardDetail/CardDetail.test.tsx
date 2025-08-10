import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CardDetail from '@components/CardDetail';

import type { BasePokemon, PokemonSpecies } from '@types';
import { useGetPokemonSpeciesQuery } from '@api/pokemonApi/pokemonApi';
import { mockPokemon, mockPokemonSpecies } from '@mocks/pokemon';

vi.mock('@api/pokemonApi/pokemonApi', () => ({
  useGetPokemonSpeciesQuery: vi.fn(),
}));

interface MockQueryResult {
  data?: PokemonSpecies;
  isLoading: boolean;
  error?: { data?: { message: string } } | Record<string, unknown>;
  isError: boolean;
  refetch?: () => void;
}

const mockUseGetPokemonSpeciesQuery = vi.mocked(useGetPokemonSpeciesQuery);

const createMockQueryResult = (partial: MockQueryResult) =>
  partial as unknown as ReturnType<typeof useGetPokemonSpeciesQuery>;

const createMockStore = () =>
  configureStore({
    reducer: {
      test: (state = {}) => state,
    },
  });

describe('CardDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProvider = (component: React.ReactElement) => {
    const store = createMockStore();
    return render(<Provider store={store}>{component}</Provider>);
  };

  it('shows spinner while loading pokemon details', async () => {
    const mockOnClose = vi.fn();
    mockUseGetPokemonSpeciesQuery.mockReturnValue(
      createMockQueryResult({
        data: undefined,
        isLoading: true,
        error: undefined,
        isError: false,
      })
    );

    renderWithProvider(
      <CardDetail pokemon={mockPokemon} onClose={mockOnClose} />
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders pokemon details correctly after loading', async () => {
    const mockOnClose = vi.fn();
    mockUseGetPokemonSpeciesQuery.mockReturnValue(
      createMockQueryResult({
        data: mockPokemonSpecies,
        isLoading: false,
        error: undefined,
        isError: false,
      })
    );

    renderWithProvider(
      <CardDetail pokemon={mockPokemon} onClose={mockOnClose} />
    );

    await waitFor(() => {
      expect(
        screen.getByText(mockPokemon.name.toUpperCase())
      ).toBeInTheDocument();
    });

    expect(screen.getByText(`#${mockPokemon.id}`)).toBeInTheDocument();
    expect(screen.getByText('Types')).toBeInTheDocument();

    mockPokemon.types.forEach((type) => {
      expect(screen.getByText(type.toUpperCase())).toBeInTheDocument();
    });
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(
      screen.getByText('A strange seed was planted on its back at birth.')
    ).toBeInTheDocument();
  });

  it('renders pokemon image with correct attributes', async () => {
    const mockOnClose = vi.fn();
    mockUseGetPokemonSpeciesQuery.mockReturnValue(
      createMockQueryResult({
        data: mockPokemonSpecies,
        isLoading: false,
        error: undefined,
        isError: false,
      })
    );

    renderWithProvider(
      <CardDetail pokemon={mockPokemon} onClose={mockOnClose} />
    );

    await waitFor(() => {
      const image = screen.getByAltText(mockPokemon.name);
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', mockPokemon.image);
    });
  });

  it('calls onClose when close button is clicked', async () => {
    const mockOnClose = vi.fn();
    mockUseGetPokemonSpeciesQuery.mockReturnValue(
      createMockQueryResult({
        data: mockPokemonSpecies,
        isLoading: false,
        error: undefined,
        isError: false,
      })
    );

    renderWithProvider(
      <CardDetail pokemon={mockPokemon} onClose={mockOnClose} />
    );

    await waitFor(() => {
      expect(
        screen.getByText(mockPokemon.name.toUpperCase())
      ).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', {
      name: /close pokemon details/i,
    });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledOnce();
  });

  it('renders all pokemon types', async () => {
    const pokemonWithMultipleTypes: BasePokemon = {
      ...mockPokemon,
      types: ['fire', 'flying', 'dragon'],
    };
    const mockOnClose = vi.fn();
    mockUseGetPokemonSpeciesQuery.mockReturnValue(
      createMockQueryResult({
        data: mockPokemonSpecies,
        isLoading: false,
        error: undefined,
        isError: false,
      })
    );

    renderWithProvider(
      <CardDetail pokemon={pokemonWithMultipleTypes} onClose={mockOnClose} />
    );

    await waitFor(() => {
      expect(screen.getByText('FIRE')).toBeInTheDocument();
    });

    expect(screen.getByText('FLYING')).toBeInTheDocument();
    expect(screen.getByText('DRAGON')).toBeInTheDocument();
  });

  it('shows error message when species fetch fails', async () => {
    const mockOnClose = vi.fn();
    mockUseGetPokemonSpeciesQuery.mockReturnValue(
      createMockQueryResult({
        data: undefined,
        isLoading: false,
        error: { data: { message: 'Species not found' } },
        isError: true,
      })
    );

    renderWithProvider(
      <CardDetail pokemon={mockPokemon} onClose={mockOnClose} />
    );

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    expect(screen.getByText('Species not found')).toBeInTheDocument();
  });

  it('shows default error message when error has no data', async () => {
    const mockOnClose = vi.fn();
    mockUseGetPokemonSpeciesQuery.mockReturnValue(
      createMockQueryResult({
        data: undefined,
        isLoading: false,
        error: {},
        isError: true,
      })
    );

    renderWithProvider(
      <CardDetail pokemon={mockPokemon} onClose={mockOnClose} />
    );

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    expect(
      screen.getByText(
        'Species not found! Try searching with a different name.'
      )
    ).toBeInTheDocument();
  });

  it('calls refetch when refresh button is clicked', async () => {
    const mockRefetch = vi.fn();
    const mockOnClose = vi.fn();

    mockUseGetPokemonSpeciesQuery.mockReturnValue(
      createMockQueryResult({
        data: mockPokemonSpecies,
        isLoading: false,
        error: undefined,
        isError: false,
        refetch: mockRefetch,
      })
    );

    renderWithProvider(
      <CardDetail pokemon={mockPokemon} onClose={mockOnClose} />
    );

    await waitFor(() => {
      expect(
        screen.getByText(mockPokemon.name.toUpperCase())
      ).toBeInTheDocument();
    });

    const refreshButton = screen.getByRole('button', { name: 'Refetch' });
    fireEvent.click(refreshButton);

    expect(mockRefetch).toHaveBeenCalledOnce();
  });

  it('calls refetch when try again button is clicked in error state', async () => {
    const mockRefetch = vi.fn();
    const mockOnClose = vi.fn();

    mockUseGetPokemonSpeciesQuery.mockReturnValue(
      createMockQueryResult({
        data: undefined,
        isLoading: false,
        error: { data: { message: 'Network error' } },
        isError: true,
        refetch: mockRefetch,
      })
    );

    renderWithProvider(
      <CardDetail pokemon={mockPokemon} onClose={mockOnClose} />
    );

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });

    const tryAgainButton = screen.getByRole('button', { name: 'Refetch' });
    fireEvent.click(tryAgainButton);

    expect(mockRefetch).toHaveBeenCalledOnce();
  });
});
