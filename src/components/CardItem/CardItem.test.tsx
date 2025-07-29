import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { mockPokemon } from '@mocks/pokemon';

import CardItem from './index';

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
