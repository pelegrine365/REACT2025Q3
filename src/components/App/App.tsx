import Header from '@components/Header';
import Navigation from '@components/Navigation';
import { Outlet, useMatches } from 'react-router-dom';

type RouteHandle = {
  title?: string;
};

const App = () => {
  const matches = useMatches();
  const matchWithTitle = [...matches]
    .reverse()
    .find((match) => (match.handle as RouteHandle)?.title);
  const title = (matchWithTitle?.handle as RouteHandle)?.title || '';

  return (
    <div className="app-container">
      <Navigation />
      {title && <Header title={title} />}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default App;
