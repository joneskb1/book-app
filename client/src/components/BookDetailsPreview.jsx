import { Link } from 'react-router-dom';
import './BookDetailsPreview.css';
import { Audio } from 'react-loader-spinner';

import ReadStatus from './ReadStatus.jsx';

export default function BookDetailsPreview(props) {
  const { handleAddBookToDB, hasRead, url, loading } = props;

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

  const parentComponent = url === 'booklist' ? 'booklist' : 'addbook';
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
            <ReadStatus
              initialHasRead={hasRead}
              googleBooksId={googleBooksId}
            />
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
