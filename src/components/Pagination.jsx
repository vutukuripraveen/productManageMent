import React from 'react';

const Pagination = ({ totalItems, currentPage, setPage, itemsPerPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  return (
    <div className="pagination">
      <span
        className={currentPage === 1 ? 'pagination__disable' : ''}
        onClick={() => goToPage(currentPage - 1)}
      >
        ◀
      </span>

      {Array.from({ length: totalPages }).map((_, i) => (
        <span
          key={i}
          className={currentPage === i + 1 ? 'pagination__selected' : ''}
          onClick={() => goToPage(i + 1)}
        >
          {i + 1}
        </span>
      ))}

      <span
        className={currentPage === totalPages ? 'pagination__disable' : ''}
        onClick={() => goToPage(currentPage + 1)}
      >
        ▶
      </span>
    </div>
  );
};

export default Pagination;
