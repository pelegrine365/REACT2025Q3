import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import CardItem from './CardItem';

const mockPokemon = {
  id: 79,
  name: 'Slowpoke',
  image:
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/79.png',
  description:
    'Incredibly slow and dopey. It takes 5 seconds for it to feel pain when under attack.',
  types: ['water', 'psychic'],
};

describe('CardItem', () => {
  const mockPokemonWithoutTypes = {
    ...mockPokemon,
    types: [],
  };

  beforeEach(() => {
    render(<CardItem {...mockPokemon} />);
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

  it('renders pokemon description', () => {
    expect(screen.getByText(mockPokemon.description)).toBeInTheDocument();
  });

  it('does not show type labels when types are empty', () => {
    const { container } = render(<CardItem {...mockPokemonWithoutTypes} />);
    const typeLabels = container.getElementsByClassName('type-label');
    expect(typeLabels.length).toBe(0);
  });

  it('handles missing description gracefully', () => {
    const pokemonWithoutDescription = {
      ...mockPokemon,
      description: '',
    };

    const { container } = render(<CardItem {...pokemonWithoutDescription} />);
    const description = container.querySelector('.card-description p');

    expect(description).toBeInTheDocument();
    expect(description).toBeEmptyDOMElement();
  });
});
