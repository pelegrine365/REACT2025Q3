import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CardList from './index';
import type { BasePokemon } from '@types';

const mockPokemons: BasePokemon[] = [
  {
    id: 26,
    name: 'raichu',
    image:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/26.png',
    types: ['electric'],
    abilities: ['static', 'lightning-rod'],
    height: 8,
    weight: 300,
    stats: [{ name: 'hp', value: 60 }],
  },
  {
    id: 27,
    name: 'nidoqueen',
    image:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/31.png',
    types: ['poison', 'ground'],
    abilities: ['poison-point', 'rivalry'],
    height: 13,
    weight: 600,
    stats: [{ name: 'hp', value: 90 }],
  },
];

const mockOnCardClick = vi.fn();

describe('CardList', () => {
  it('renders correct number of pokemon cards', () => {
    render(<CardList results={mockPokemons} onCardClick={mockOnCardClick} />);

    const headings = screen.getAllByRole('heading', { level: 2 });
    expect(headings.length).toBe(2);
  });

  it('renders pokemon names and IDs', () => {
    render(<CardList results={mockPokemons} onCardClick={mockOnCardClick} />);

    for (const pokemon of mockPokemons) {
      expect(
        screen.getByRole('heading', {
          name: pokemon.name.toUpperCase(),
          level: 2,
        })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('heading', {
          name: `#${pokemon.id}`,
          level: 3,
        })
      ).toBeInTheDocument();
    }
  });

  it('renders no cards when results is empty', () => {
    render(<CardList results={[]} onCardClick={mockOnCardClick} />);

    const headings = screen.queryAllByRole('heading', { level: 2 });
    expect(headings.length).toBe(0);
  });
});
