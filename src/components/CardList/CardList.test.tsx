import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { mockPokemonList } from '@mocks/pokemon';

import CardList from './index';

const mockOnCardClick = vi.fn();

describe('CardList', () => {
  it('renders correct number of pokemon cards', () => {
    render(
      <CardList results={mockPokemonList} onCardClick={mockOnCardClick} />
    );

    const headings = screen.getAllByRole('heading', { level: 2 });
    expect(headings.length).toBe(2);
  });

  it('renders pokemon names and IDs', () => {
    render(
      <CardList results={mockPokemonList} onCardClick={mockOnCardClick} />
    );

    for (const pokemon of mockPokemonList) {
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
