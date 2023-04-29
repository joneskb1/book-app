import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BookDetailsPreview.css';

export default function BookDetailsPreview(props) {
  const {
    title,
    authors,
    isbn,
    publishedDate,
    categories,
    pageCount,
    googleBookId,
    inUsersBooks,
  } = props.book;

  const { handleAddBookToDB } = props;

  return (
    <Link
      to='/bookdetails'
      className='book-detail-preview link-util'
      state={{ book: props.book }}
    >
      <div className='book'>
        <div className='title-container'>
          {/* check string.length and slice to whatever fits, add ... */}
          <p className='title'>
            {title.slice(0, 63)} {title.length >= 61 ? '...' : ''}
          </p>
          {inUsersBooks === false && (
            <button
              onClick={handleAddBookToDB}
              data-id={googleBookId}
              className='search-btn'
              type='button'
            >
              Add Book
            </button>
          )}
          {inUsersBooks && (
            <p className='book-in-list-msg'>This Book Is In Your List</p>
          )}
        </div>

        <div className='search-book-details'>
          <p>Author: {authors[0]}</p>
          <p>ISBN: {isbn}</p>
          <p>Publish Date: {publishedDate}</p>
          <p>Category: {categories[0]}</p>
          <p>Page Count: {pageCount}</p>
        </div>
      </div>
    </Link>
  );
}
