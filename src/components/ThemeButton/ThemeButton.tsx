import { THEME_DAY, THEME_NIGHT } from '@constants';
import { useTheme } from '@hooks/useTheme';

import './index.css';

const ThemeButton = () => {
  const { theme, setTheme } = useTheme();

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
