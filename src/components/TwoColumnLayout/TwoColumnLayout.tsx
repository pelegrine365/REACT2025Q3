import type { ReactNode } from 'react';
import './index.css';

interface TwoColumnLayoutProps {
  leftColumn: ReactNode;
  rightColumn: ReactNode;
  isDetailOpen: boolean;
}

const TwoColumnLayout = ({
  leftColumn,
  rightColumn,
  isDetailOpen,
}: TwoColumnLayoutProps) => {
  return (
    <div className={`two-column-layout ${isDetailOpen ? 'detail-open' : ''}`}>
      <div className="left-column">{leftColumn}</div>
      {isDetailOpen && <div className="right-column">{rightColumn}</div>}
    </div>
  );
};

export default TwoColumnLayout;
