import { useState } from 'react';
import { Outlet, useMatches } from 'react-router';
import { useSelector } from 'react-redux';
import type { RootState } from 'store';
import { ThemeContext } from 'contexts';

import Navigation from '@components/Navigation';
import ThemeButton from '@components/ThemeButton';
import Header from '@components/Header';
import BulkActionsToolbar from '@components/BulkActionsToolbar';

import { THEME_DAY } from '@constants';

type RouteHandle = {
  title?: string;
};

const App = () => {
  const [theme, setTheme] = useState(THEME_DAY);

  const matches = useMatches();
  const matchWithTitle = [...matches]
    .reverse()
    .find((match) => (match.handle as RouteHandle)?.title);

  const title = (matchWithTitle?.handle as RouteHandle)?.title || '';

  const selectedItemsList = useSelector(
    (state: RootState) => state.selectedItems.selectedItems
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`app-container theme-${theme}`}>
        <Navigation />
        <ThemeButton />
        {title && <Header title={title} />}
        <main>
          <Outlet />
        </main>
        {!!selectedItemsList.length && (
          <BulkActionsToolbar selectedItems={selectedItemsList} />
        )}
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
