import type { BasePokemon } from '@types';
import CardItem from '@components/CardItem';

import './index.css';

interface CardListProps {
  results: Partial<BasePokemon>[];
}

const CardList = ({ results }: CardListProps) => {
  return (
    <div className="card-list">
      {results.map((result) => (
        <CardItem key={result.id} {...result} />
      ))}
    </div>
  );
};

export default CardList;
