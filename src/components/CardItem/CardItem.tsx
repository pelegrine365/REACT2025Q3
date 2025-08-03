import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from 'store';
import { addSelectedItem, removeSelectedItem } from 'store/selectedItemsSlice';
import type { BasePokemon } from '@types';
import { useTheme } from '@hooks/useTheme';

import './index.css';

interface CardItemProps {
  pokemon: BasePokemon;
  onCardClick: (pokemonId: number) => void;
}

const CardItem = ({ pokemon, onCardClick }: CardItemProps) => {
  const dispatch = useDispatch();
  const isSelected = useSelector((state: RootState) =>
    state.selectedItems.selectedItems.some((item) => item.id === pokemon.id)
  );
  const { id, name, image } = pokemon;
  const { theme } = useTheme();
  const [hasImageError, setHasImageError] = useState(false);

  const handleImageError = () => {
    setHasImageError(true);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.target.checked) {
      dispatch(addSelectedItem(pokemon));
    } else {
      dispatch(removeSelectedItem(id));
    }
  };

  const shouldShowFallback = hasImageError || !image || image.trim() === '';

  return (
    <div
      className={`card theme-${theme}`}
      onClick={() => onCardClick(id)}
      data-testid="pokemon-card"
    >
      <label className="card-checkbox" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          className="checkbox-input"
        />
        <img
          src="/pokeball.svg"
          alt="pokeball"
          className={`pokeball-icon ${isSelected ? 'checked' : ''}`}
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
