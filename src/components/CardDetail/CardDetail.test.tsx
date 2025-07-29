import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CardDetail from '@components/CardDetail';

import type { BasePokemon } from '@types';

import { mockPokemon, mockPokemonSpecies } from '@mocks/pokemon';

vi.mock('@api/fetchPokemonBySpecies', () => ({
  fetchPokemonBySpecies: vi.fn(),
}));

import { fetchPokemonBySpecies } from '@api/fetchPokemonBySpecies';
const mockFetchPokemonBySpecies = vi.mocked(fetchPokemonBySpecies);

describe('CardDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows spinner while loading pokemon details', async () => {
    const mockOnClose = vi.fn();
    mockFetchPokemonBySpecies.mockImplementation(() => new Promise(() => {}));

    render(<CardDetail pokemon={mockPokemon} onClose={mockOnClose} />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders pokemon details correctly after loading', async () => {
    const mockOnClose = vi.fn();
    mockFetchPokemonBySpecies.mockResolvedValue(mockPokemonSpecies);

    render(<CardDetail pokemon={mockPokemon} onClose={mockOnClose} />);

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
    mockFetchPokemonBySpecies.mockResolvedValue(mockPokemonSpecies);

    render(<CardDetail pokemon={mockPokemon} onClose={mockOnClose} />);

    await waitFor(() => {
      const image = screen.getByAltText(mockPokemon.name);
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', mockPokemon.image);
    });
  });

  it('calls onClose when close button is clicked', async () => {
    const mockOnClose = vi.fn();
    mockFetchPokemonBySpecies.mockResolvedValue(mockPokemonSpecies);

    render(<CardDetail pokemon={mockPokemon} onClose={mockOnClose} />);

    await waitFor(() => {
      expect(
        screen.getByText(mockPokemon.name.toUpperCase())
      ).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledOnce();
  });

  it('renders all pokemon types', async () => {
    const pokemonWithMultipleTypes: BasePokemon = {
      ...mockPokemon,
      types: ['fire', 'flying', 'dragon'],
    };
    const mockOnClose = vi.fn();
    mockFetchPokemonBySpecies.mockResolvedValue(mockPokemonSpecies);

    render(
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
    mockFetchPokemonBySpecies.mockRejectedValue(new Error('Species not found'));

    render(<CardDetail pokemon={mockPokemon} onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    expect(screen.getByText('Species not found')).toBeInTheDocument();
  });

  it('refetches data when pokemon changes', async () => {
    const mockOnClose = vi.fn();
    mockFetchPokemonBySpecies.mockResolvedValue(mockPokemonSpecies);

    const { rerender } = render(
      <CardDetail pokemon={mockPokemon} onClose={mockOnClose} />
    );

    await waitFor(() => {
      expect(mockFetchPokemonBySpecies).toHaveBeenCalledWith(mockPokemon.name);
    });

    const newPokemon = { ...mockPokemon, name: 'Charmander', id: 4 };
    rerender(<CardDetail pokemon={newPokemon} onClose={mockOnClose} />);

    await waitFor(() => {
      expect(mockFetchPokemonBySpecies).toHaveBeenCalledWith(newPokemon.name);
    });

    expect(mockFetchPokemonBySpecies).toHaveBeenCalledTimes(2);
  });
});
