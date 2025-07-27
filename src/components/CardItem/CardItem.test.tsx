import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CardItem from './index';
import type { BasePokemon } from '@types';

const mockPokemon: BasePokemon = {
  id: 79,
  name: 'Slowpoke',
  image:
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/79.png',
  types: ['water', 'psychic'],
  abilities: ['oblivious', 'own-tempo'],
  height: 12,
  weight: 360,
  stats: [
    { name: 'hp', value: 90 },
    { name: 'attack', value: 65 },
  ],
};

const mockOnCardClick = vi.fn();

describe('CardItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    render(<CardItem pokemon={mockPokemon} onCardClick={mockOnCardClick} />);
  });

  it('renders pokemon name in uppercase', () => {
    expect(
      screen.getByRole('heading', {
        name: mockPokemon.name.toUpperCase(),
        level: 2,
      })
    ).toBeInTheDocument();
  });

  it('renders pokemon id with prefix', () => {
    expect(
      screen.getByRole('heading', {
        name: `#${mockPokemon.id}`,
        level: 3,
      })
    ).toBeInTheDocument();
  });

  it('renders pokemon image with correct alt text', () => {
    const image = screen.getByRole('img', { name: mockPokemon.name });

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockPokemon.image);
  });
});
