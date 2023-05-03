import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './BookDetailsPreview.css';
import { Audio } from 'react-loader-spinner';
import greenCheck from '../assets/green-check.svg';
import unreadX from '../assets/unread-x.svg';

export default function BookDetailsPreview(props) {
  const { handleAddBookToDB, hasRead, url, loading } = props;
  const parentComponent = url === 'booklist' ? 'booklist' : 'addbook';

  const [error, setError] = useState(null);
  const [imgSrc, setImgSrc] = useState(() =>
    props.hasRead ? greenCheck : unreadX
  );

  const {
    title,
    authors,
    isbn,
    publishedDate,
    categories,
    pageCount,
    googleBooksId,
    inUsersBooks,
  } = props.book;

  async function handleReadClick(e) {
    e.preventDefault();
    try {
      const hasReadStatus =
        imgSrc === '/src/assets/unread-x.svg' ? 'read' : 'unread';
      const image =
        imgSrc === '/src/assets/unread-x.svg'
          ? '/src/assets/green-check.svg'
          : '/src/assets/unread-x.svg';

      const url = `/api/v1/users/mark${hasReadStatus}/${googleBooksId}`;

      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json',
        },
      });
      const data = await res.json();

      if (data.status === 'success') {
        setError(null);
        setImgSrc(image);
      } else {
        // maybe throw data.message into catch block
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Link
      to='/bookdetails'
      className='book-detail-preview link-util'
      state={{ book: props.book, url: url, hasRead: hasRead }}
    >
      <div className='book'>
        <div className='title-container'>
          {/* check string.length and slice to whatever fits, add ... */}
          <p className='title'>
            {title.slice(0, 63)} {title.length >= 61 ? '...' : ''}
          </p>
          {parentComponent === 'booklist' && (
            <>
              <img onClick={handleReadClick} src={imgSrc} alt={'read status'} />
            </>
          )}
          {loading && (
            <Audio
              height='30'
              width='30'
              radius='5'
              color='#087E8B'
              ariaLabel='loading'
              // wrapperStyle
              // wrapperClass
            />
          )}
          {!loading && inUsersBooks === false && (
            <button
              onClick={handleAddBookToDB}
              data-id={googleBooksId}
              className='search-btn'
              type='button'
            >
              Add Book
            </button>
          )}
          {!loading && inUsersBooks && (
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
