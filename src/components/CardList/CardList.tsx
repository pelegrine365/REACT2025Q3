import { Component } from 'react';
import type { Pokemon } from '../../types';
import CardItem from '../CardItem';

import './index.css';

interface CardListProps {
  results: Pokemon[];
}

class CardList extends Component<CardListProps> {
  render() {
    return (
      <div className="card-list">
        {this.props.results.map((result) => (
          <CardItem key={result.id} {...result} />
        ))}
      </div>
    );
  }
}

export default CardList;
