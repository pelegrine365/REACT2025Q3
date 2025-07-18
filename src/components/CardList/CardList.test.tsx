import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CardList from '../CardList';


const mockPokemons = [
  {
    id: 26,
    name: 'raichu',
    image:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/26.png',
    description:
      'Its long tail serves as a ground to protect itself from its own high-voltage power.',
    types: ['electric'],
  },
  {
    id: 27,
    name: 'nidoqueen',

    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/31.png',
    description:
      'Its hard scales provide strong protection. It uses its hefty bulk to execute powerful moves.',
    types: ['poison', 'ground'],
  },
];

describe('CardList', () => {
  it('renders correct number of pokemon cards', () => {
    render(<CardList results={mockPokemons} />);


    const headings = screen.getAllByRole('heading', { level: 2 });
    expect(headings.length).toBe(2);
  });

  it('renders pokemon names and IDs', () => {
    render(<CardList results={mockPokemons} />);

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

  it('renders pokemon descriptions', () => {
    render(<CardList results={mockPokemons} />);

    expect(
      screen.getByText(
        'Its long tail serves as a ground to protect itself from its own high-voltage power.'
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Its hard scales provide strong protection. It uses its hefty bulk to execute powerful moves.'
      )
    ).toBeInTheDocument();
  });

  it('renders no cards when results is empty', () => {
    render(<CardList results={[]} />);

    const headings = screen.queryAllByRole('heading', { level: 2 });
    expect(headings.length).toBe(0);
  });
});
