import { configureStore } from '@reduxjs/toolkit';
import selectedItemsReducer from './selectedItemsSlice';
import { githubApi } from '@api/githubApi';
import { setupListeners } from '@reduxjs/toolkit/query';
import { pokemonApi } from '@api/pokemonApi';

export const store = configureStore({
  reducer: {
    selectedItems: selectedItemsReducer,
    [githubApi.reducerPath]: githubApi.reducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(githubApi.middleware, pokemonApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
