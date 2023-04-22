import React from 'react';
import { Link } from 'react-router-dom';
import './BookDetailsPreview.css';

export default function BookDetailsPreview({ props }) {
  const {
    title,
    author,
    isbn,
    publishedDate,
    category,
    pageCount,
    handleAddBookToDB,
    googleBooksId,
  } = props;

  console.log(title, title.length);
  return (
    <Link to='/bookdetails' className='book-detail-preview link-util'>
      <div className='book'>
        <div className='title-container'>
          {/* check string.length and slice to whatever fits, add ... */}
          <p className='title'>
            {title.slice(0, 65)} {title.length >= 62 ? '...' : ''}
          </p>
          <button onClick={handleAddBookToDB} className='search-btn'>
            Add Book
          </button>
        </div>

        <div className='search-book-details'>
          <p>Author: {author}</p>
          <p>ISBN: {isbn}</p>
          <p>Publish Date: {publishedDate}</p>
          <p>Category: {category}</p>
          <p>Page Count: {pageCount}</p>
        </div>
      </div>
    </Link>
  );
}
