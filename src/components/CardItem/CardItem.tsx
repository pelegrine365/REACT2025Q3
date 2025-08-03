import type { BasePokemon } from '@types';
import { useState } from 'react';
import './index.css';

interface CardItemProps {
  pokemon: BasePokemon;
  onCardClick: (pokemonId: number) => void;
}

const CardItem = ({ pokemon, onCardClick }: CardItemProps) => {
  const { id, name, image } = pokemon;
  const [hasImageError, setHasImageError] = useState(false);

  const handleImageError = () => {
    setHasImageError(true);
  };

  const shouldShowFallback = hasImageError || !image || image.trim() === '';

  return (
    <div className="card" onClick={() => onCardClick(id)}>
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
