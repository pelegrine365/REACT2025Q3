import { useState } from 'react';
import { Route, Routes } from 'react-router';
import { ThemeContext } from 'contexts';

import HomePage from '@pages/HomePage';
import AboutPage from '@pages/AboutPage';
import NotFoundPage from '@pages/NotFoundPage';

import Navigation from '@components/Navigation';
import ErrorBoundary from '@components/ErrorBoundary';
import ThemeButton from '@components/ThemeButton';

import { THEME_DAY } from '@constants';

import './index.css';

interface ThemeContext {
  theme: string;
  setTheme: () => void;
}

const App = () => {
  const [theme, setTheme] = useState(THEME_DAY);
  return (
    <ErrorBoundary>
      <ThemeContext value={{ theme, setTheme }}>
        <div className={`app-container theme-${theme}`}>
          <Navigation />
          <ThemeButton />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </ThemeContext>
    </ErrorBoundary>
  );
};

export default App;
