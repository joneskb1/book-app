import React from 'react';
import './Paginate.css';
import arrowLeft from '../assets/arrow-left.svg';
import arrowRight from '../assets/arrow-right.svg';

export default function Paginate(props) {
  const {
    itemsPerPage,
    totalItems,
    currentPage,
    currentBooks,
    books,
    booksPerPage,
    setCurrentPage,
  } = props;
  const pages = [];
  const totalNumPages = Math.ceil(totalItems / itemsPerPage);

  for (let i = 1; i <= totalNumPages; i++) {
    pages.push(i);
  }

  const handlePageChange = async (pageNum) => {
    setCurrentPage(pageNum);
  };

  const handlePageChangeArrow = (e) => {
    if (!currentBooks) return;

    if (
      e.currentTarget.className.includes('arrow-right') &&
      currentPage < books.length / booksPerPage
    ) {
      return setCurrentPage((prevState) => prevState + 1);
    }

    if (e.currentTarget.className.includes('arrow-left') && currentPage > 1) {
      return setCurrentPage((prevState) => prevState - 1);
    }
  };

  return (
    <div className='paginate-wrap'>
      <button
        className='btn-util arrow-left'
        onClick={handlePageChangeArrow}
        aria-label='left arrow'
      >
        <img src={arrowLeft} className='arrow' />
      </button>
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
      <button
        className='btn-util arrow-right'
        onClick={handlePageChangeArrow}
        aria-label='right arrow'
      >
        <img src={arrowRight} className='arrow' />
      </button>
    </div>
  );
}
