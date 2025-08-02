import { useState } from 'react';
import { Outlet, useMatches } from 'react-router';
import { ThemeContext } from 'contexts';

import Navigation from '@components/Navigation';
import ThemeButton from '@components/ThemeButton';

import { THEME_DAY } from '@constants';
import Header from '@components/Header';

type RouteHandle = {
  title?: string;
};

const App = () => {
  const matches = useMatches();
  const matchWithTitle = [...matches]
    .reverse()
    .find((match) => (match.handle as RouteHandle)?.title);
  const title = (matchWithTitle?.handle as RouteHandle)?.title || '';
  const [theme, setTheme] = useState(THEME_DAY);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`app-container theme-${theme}`}>
        <Navigation />
        <ThemeButton />
        {title && <Header title={title} />}
        <main>
          <Outlet />
        </main>
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
