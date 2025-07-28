import { ThemeContext } from 'contexts';
import { useContext } from 'react';
import { THEME_DAY, THEME_NIGHT } from '@constants';

import './index.css';

const ThemeButton = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  const handleClick = () => {
    setTheme(theme === THEME_DAY ? THEME_NIGHT : THEME_DAY);
  };

  return (
    <button
      onClick={handleClick}
      className={`theme-button theme-${theme}`}
    ></button>
  );
};

export default ThemeButton;
