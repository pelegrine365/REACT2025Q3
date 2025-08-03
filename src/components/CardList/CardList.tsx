import type { BasePokemon } from '@types';
import CardItem from '@components/CardItem';

import './index.css';

interface CardListProps {
  results: BasePokemon[];
  onCardClick: (pokemonId: number) => void;
}

const CardList = ({ results, onCardClick }: CardListProps) => {
  return (
    <div className="card-list">
      {results.map((result) => (
        <CardItem key={result.id} pokemon={result} onCardClick={onCardClick} />
      ))}
    </div>
  );
};

export default CardList;
