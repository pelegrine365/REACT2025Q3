import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { BasePokemon } from '@types';

export interface SelectedItemsState {
  selectedItems: BasePokemon[];
}

const initialState: SelectedItemsState = {
  selectedItems: [],
};

const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    addSelectedItem: (state, action: PayloadAction<BasePokemon>) => {
      state.selectedItems.push(action.payload);
    },
    removeSelectedItem: (state, action: PayloadAction<number>) => {
      state.selectedItems = state.selectedItems.filter(
        (item) => item.id !== action.payload
      );
    },
    clearSelectedItems: (state) => {
      state.selectedItems = [];
    },
  },
});

export const { addSelectedItem, removeSelectedItem, clearSelectedItems } =
  selectedItemsSlice.actions;

export default selectedItemsSlice.reducer;
