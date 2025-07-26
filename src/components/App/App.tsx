import Navigation from '@components/Navigation';
import { Route, Routes } from 'react-router';
import HomePage from 'pages/HomePage';
import AboutPage from 'pages/AboutPage';
import ErrorBoundary from '@components/ErrorBoundary';

import './index.css';

const App = () => {
  return (
    <ErrorBoundary>
      <div className="app-container">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;
