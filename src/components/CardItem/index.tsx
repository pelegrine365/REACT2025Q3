import { Component } from 'react';
import './index.css';
import type { Pokemon } from '../../types';

class CardItem extends Component<Pokemon> {
  render() {
    const { id, name, image, description, types } = this.props;

    return (
      <div className="card">
        <div className="card-header">
          <div className="card-image">
            <img src={image} alt={name} />
          </div>
          <div className="card-name">
            <h2>{name.toUpperCase()} </h2>
            <h3 className="card-id">#{id}</h3>
          </div>
        </div>

        <div className="card-main">
          <div className="card-description">
            <p>{description}</p>
          </div>
          <div className="card-types">
            {types.map((type) => (
              <span key={type} className="type-label">
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default CardItem;
