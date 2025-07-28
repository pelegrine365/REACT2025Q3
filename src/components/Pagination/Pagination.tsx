import { getVisiblePages } from '@utils/getVisiblePages';

import './index.css';
import { useContext } from 'react';
import { ThemeContext } from 'contexts';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNext: boolean;
  hasPrev: boolean;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  hasNext,
  hasPrev,
}: PaginationProps) => {
  const visiblePages = getVisiblePages(currentPage, totalPages);
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`pagination theme-${theme}`}>
      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
      >
        Previous
      </button>
      {visiblePages.map((page) => (
        <button
          key={page}
          className={`pagination-button ${page === currentPage ? 'active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
      >
        Next
      </button>
      <div className="pagination-info">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default Pagination;
