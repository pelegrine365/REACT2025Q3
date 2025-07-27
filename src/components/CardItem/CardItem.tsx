import type { BasePokemon } from '@types';
import { useState } from 'react';
import './index.css';

const CardItem = ({ id, name, image }: Partial<BasePokemon>) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const shouldShowFallback = imageError || !image || image.trim() === '';

  return (
    <div className="card">
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
