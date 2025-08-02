import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import selectedItemsReducer from 'store/selectedItemsSlice';
import { ThemeContext } from 'contexts';
import { mockPokemon } from '@mocks/pokemon';

import CardItem from './index';

const mockOnCardClick = vi.fn();

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
    },
    preloadedState,
  });
};

const TestWrapper = ({
  children,
  store = createTestStore(),
  theme = 'light',
}: {
  children: React.ReactNode;
  store?: ReturnType<typeof createTestStore>;
  theme?: string;
}) => (
  <Provider store={store}>
    <ThemeContext.Provider value={{ theme, setTheme: vi.fn() }}>
      {children}
    </ThemeContext.Provider>
  </Provider>
);

describe('CardItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderCardItem = (store?: ReturnType<typeof createTestStore>) => {
    return render(
      <TestWrapper store={store}>
        <CardItem pokemon={mockPokemon} onCardClick={mockOnCardClick} />
      </TestWrapper>
    );
  };

  it('renders pokemon name in uppercase', () => {
    renderCardItem();

    expect(
      screen.getByRole('heading', {
        name: mockPokemon.name.toUpperCase(),
        level: 2,
      })
    ).toBeInTheDocument();
  });

  it('renders pokemon id with prefix', () => {
    renderCardItem();

    expect(
      screen.getByRole('heading', {
        name: `#${mockPokemon.id}`,
        level: 3,
      })
    ).toBeInTheDocument();
  });

  it('renders pokemon image with correct alt text', () => {
    renderCardItem();

    const image = screen.getByRole('img', { name: mockPokemon.name });

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockPokemon.image);
  });

  it('renders checkbox', () => {
    renderCardItem();

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('checkbox is checked when pokemon is selected in store', () => {
    const storeWithSelectedItem = createTestStore({
      selectedItems: {
        selectedItems: [mockPokemon],
      },
    });

    renderCardItem(storeWithSelectedItem);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('calls dispatch when checkbox is toggled', () => {
    const store = createTestStore();
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    renderCardItem(store);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('calls onCardClick when card is clicked', () => {
    renderCardItem();

    const card = screen.getByTestId('pokemon-card');
    fireEvent.click(card);

    expect(mockOnCardClick).toHaveBeenCalledWith(mockPokemon.id);
  });

  it('does not call onCardClick when checkbox is clicked', () => {
    renderCardItem();

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockOnCardClick).not.toHaveBeenCalled();
  });
});
