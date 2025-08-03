import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import App from '@components/App';
import ErrorBoundary from '@components/ErrorBoundary';

import CardsPage from '@pages/CardsPage';
import AboutPage from '@pages/AboutPage';
import NotFoundPage from '@pages/NotFoundPage';

import { CARDS_PAGE_TITLE, ABOUT_PAGE_TITLE } from '@constants';

export const router = createBrowserRouter([
  {
    path: '/',
    element: React.createElement(App),
    errorElement: React.createElement(ErrorBoundary),
    children: [
      {
        index: true,
        element: React.createElement(CardsPage),
        handle: { title: CARDS_PAGE_TITLE },
      },
      {
        path: 'about',
        element: React.createElement(AboutPage),
        handle: { title: ABOUT_PAGE_TITLE },
      },
      {
        path: '*',
        element: React.createElement(NotFoundPage),
      },
    ],
  },
]);
