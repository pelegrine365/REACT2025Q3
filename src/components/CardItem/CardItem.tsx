import type { BasePokemon } from '@types';
import { useContext, useState } from 'react';
import { ThemeContext } from 'contexts';

import './index.css';

interface CardItemProps {
  pokemon: BasePokemon;
  onCardClick: (pokemonId: number) => void;
}

const CardItem = ({ pokemon, onCardClick }: CardItemProps) => {
  const { id, name, image } = pokemon;
  const { theme } = useContext(ThemeContext);
  const [hasImageError, setHasImageError] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleImageError = () => {
    setHasImageError(true);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setIsChecked(e.target.checked);
  };

  const shouldShowFallback = hasImageError || !image || image.trim() === '';

  return (
    <div className={`card theme-${theme}`} onClick={() => onCardClick(id)}>
      <label className="card-checkbox" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="checkbox-input"
        />
        <img
          src="/pokeball.svg"
          alt="pokeball"
          className={`pokeball-icon ${isChecked ? 'checked' : ''}`}
        />
      </label>
      <div className="card-header">
        <div className="card-image">
          {shouldShowFallback ? (
            <div className="card-image-fallback">Not found</div>
          ) : (
            <img src={image} alt={name} onError={handleImageError} />
          )}
        </div>
        <div className="card-name-section">
          <h2 className="card-name">{name?.toUpperCase() || 'UNKNOWN'}</h2>
          <h3 className="card-id">#{id}</h3>
        </div>
      </div>
    </div>
  );
};

export default CardItem;
