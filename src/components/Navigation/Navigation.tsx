import { NavLink } from 'react-router';

import './index.css';

const Navigation = () => {
  return (
    <nav className="navigation">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/about">About</NavLink>
    </nav>
  );
};

export default Navigation;
