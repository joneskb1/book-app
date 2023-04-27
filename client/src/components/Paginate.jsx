import React from 'react';
import './Paginate.css';

export default function Paginate(props) {
  const { itemsPerPage, totalItems, handlePageChange, currentPage } = props;
  const pages = [];
  const totalNumPages = Math.ceil(totalItems / itemsPerPage);

  for (let i = 1; i <= totalNumPages; i++) {
    pages.push(i);
  }

  return (
    <ul className='paginate'>
      {pages.map((page) => {
        return (
          <button
            className='btn-util btn-paginate'
            key={page}
            onClick={() => handlePageChange(page)}
          >
            <li
              className={`li-util li-paginate ${
                page == currentPage ? 'active' : ''
              }`}
            >
              {page}
            </li>
          </button>
        );
      })}
    </ul>
  );
}
