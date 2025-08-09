import type { BasePokemon } from '@types';
import { useEffect, useState } from 'react';
import Spinner from '@components/Spinner';
import { useTheme } from '@hooks/useTheme';
import { useGetPokemonSpeciesQuery } from '@api/pokemonApi/pokemonApi';

import './index.css';

interface CardDetailProps {
  pokemon: BasePokemon;
  onClose: () => void;
}

const CardDetail = ({ pokemon, onClose }: CardDetailProps) => {
  const [hasImageError, setHasImageError] = useState(false);
  const { theme } = useTheme();

  const { name, id, image, types, abilities, height, weight, stats } = pokemon;

  const {
    data: details,
    isLoading,
    error,
    isError,
  } = useGetPokemonSpeciesQuery(name, {
    skip: !name,
  });

  const shouldShowFallback = hasImageError || !image || image.trim() === '';

  const handleImageError = () => {
    setHasImageError(true);
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const errorMessage = isError
    ? (error as { data?: { message?: string } })?.data?.message ||
      'Species not found! Try searching with a different name.'
    : '';

  return (
    <>
      {isLoading && <Spinner />}
      {!isLoading && isError && (
        <div className={`card-detail theme-${theme}`}>
          <div className="card-detail-header">
            <h2 className="card-detail-title">Error</h2>
            <button
              className="card-detail-close"
              onClick={onClose}
              aria-label="Close pokemon details"
              title="Close (Esc)"
            >
              ✕
            </button>
          </div>
          <div className="card-detail-content">
            <div className="error-message">{errorMessage}</div>
          </div>
        </div>
      )}
      {!isLoading && !isError && (
        <div className="card-detail">
          <div className="card-detail-header">
            <h2 className="card-detail-title">
              {name?.toUpperCase() || 'UNKNOWN'}
            </h2>
            <button
              className="card-detail-close"
              onClick={onClose}
              aria-label="Close pokemon details"
              title="Close (Esc)"
            >
              ✕
            </button>
          </div>
          <div className="card-detail-content">
            <div className="card-detail-image">
              {shouldShowFallback ? (
                <div className="card-detail-image-fallback">
                  <span>Image not found</span>
                </div>
              ) : (
                <img src={image} alt={name} onError={handleImageError} />
              )}
            </div>

            <div className="card-detail-info">
              <div className="card-detail-id">
                <span className="id-label">ID:</span>
                <span className="id-value">#{id}</span>
              </div>

              {details?.description && (
                <div className="card-detail-description">
                  <h3>Description</h3>
                  <p>{details.description}</p>
                </div>
              )}

              {details?.genus && (
                <div className="card-detail-genus">
                  <h3>Category</h3>
                  <p>{details.genus}</p>
                </div>
              )}

              <div className="card-detail-types">
                <h3>Types</h3>
                <div className="types-container">
                  {types?.map((type) => (
                    <span key={type} className="type-badge">
                      {type.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              {abilities && abilities.length > 0 && (
                <div className="card-detail-abilities">
                  <h3>Abilities</h3>
                  <div className="abilities-container">
                    {abilities.map((ability) => (
                      <span key={ability} className="ability-badge">
                        {ability.replace('-', ' ').toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="card-detail-physical">
                <h3>Physical Stats</h3>
                <div className="physical-stats">
                  {height && (
                    <div className="stat-item">
                      <span className="stat-label">Height:</span>
                      <span className="stat-value">
                        {(height / 10).toFixed(1)} m
                      </span>
                    </div>
                  )}
                  {weight && (
                    <div className="stat-item">
                      <span className="stat-label">Weight:</span>
                      <span className="stat-value">
                        {(weight / 10).toFixed(1)} kg
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {details && (
                <div className="card-detail-species-info">
                  <h3>Species Info</h3>
                  <div className="species-info-container">
                    <div className="stat-item">
                      <span className="stat-label">Color:</span>
                      <span className="stat-value">
                        {details.color.toUpperCase()}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Shape:</span>
                      <span className="stat-value">
                        {details.shape.toUpperCase()}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Generation:</span>
                      <span className="stat-value">
                        {details.generation.toUpperCase().replace('-', ' ')}
                      </span>
                    </div>
                    {details.isLegendary && (
                      <div className="stat-item">
                        <span className="legendary-badge">LEGENDARY</span>
                      </div>
                    )}
                    {details.isMythical && (
                      <div className="stat-item">
                        <span className="mythical-badge">MYTHICAL</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {stats && stats.length > 0 && (
                <div className="card-detail-stats">
                  <h3>Base Stats</h3>
                  <div className="stats-container">
                    {stats.map((stat) => (
                      <div key={stat.name} className="stat-item">
                        <span className="stat-label">
                          {stat.name.replace('-', ' ').toUpperCase()}:
                        </span>
                        <span className="stat-value">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CardDetail;
