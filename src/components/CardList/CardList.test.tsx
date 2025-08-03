import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { mockPokemonList } from '@mocks/pokemon';
import { createTestStore, TestWrapper } from '@testUtils/testUtils';

import CardList from './index';

const mockOnCardClick = vi.fn();

describe('CardList component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderCardList = (
    results = mockPokemonList,
    store?: ReturnType<typeof createTestStore>
  ) => {
    return render(
      <TestWrapper store={store}>
        <CardList results={results} onCardClick={mockOnCardClick} />
      </TestWrapper>
    );
  };
  it('renders correct number of pokemon cards', () => {
    renderCardList();

    const cards = screen.getAllByTestId('pokemon-card');
    expect(cards.length).toBe(mockPokemonList.length);
  });

  it('renders pokemon names and IDs', () => {
    renderCardList();

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
    renderCardList([]);

    const cards = screen.queryAllByTestId('pokemon-card');
    expect(cards.length).toBe(0);
  });

  it('renders checkboxes for all cards', () => {
    renderCardList();

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(mockPokemonList.length);

    checkboxes.forEach((checkbox) => {
      expect(checkbox).not.toBeChecked();
    });
  });

  it('calls onCardClick when card is clicked', () => {
    renderCardList();

    const firstCard = screen.getAllByTestId('pokemon-card')[0];
    fireEvent.click(firstCard);

    expect(mockOnCardClick).toHaveBeenCalledWith(mockPokemonList[0].id);
  });

  it('shows selected state when pokemon is selected in store', () => {
    const storeWithSelectedItem = createTestStore({
      selectedItems: {
        selectedItems: [mockPokemonList[0]],
      },
    });

    renderCardList(mockPokemonList, storeWithSelectedItem);

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });
});
