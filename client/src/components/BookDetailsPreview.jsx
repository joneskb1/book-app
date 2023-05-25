import { Link } from 'react-router-dom';
import './BookDetailsPreview.css';
import { Audio } from 'react-loader-spinner';
import { useEffect, useState } from 'react';

import ReadStatus from './ReadStatus.jsx';

export default function BookDetailsPreview(props) {
  const { hasRead, url, book, books, setBooks, currentPage } = props;

  const {
    title,
    authors,
    isbn,
    publishedDate,
    categories,
    pageCount,
    googleBooksId,
    _id: id,
  } = book;

  const [inList, setInList] = useState(book.inUsersBooks);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const parentComponent = url === 'booklist' ? 'booklist' : 'addbook';

  useEffect(() => {
    setInList(book.inUsersBooks);
  }, [currentPage, book.inUsersBooks]);

  const updateBooks = (books, id) => {
    // const book = books.find((book) => book.googleBooksId === id);

    // setBooks([...books, { ...books[book], inUsersBooks: true }]);

    const updatedBooks = books.map((book) => {
      if (book.googleBooksId === id) {
        return { ...book, inUsersBooks: true };
      }
      return book;
    });

    setBooks(updatedBooks);
  };

  async function handleAddBookToDB(e) {
    e.preventDefault();
    const id = e.target.dataset.id;
    updateBooks(books, id);

    try {
      // setLoading({ [id]: true });
      setLoading(true);
      const res = await fetch(`/api/v1/books/${id}`, {
        method: 'POST',
      });

      const data = await res.json();

      if (data.status === 'success') {
        setError(null);
        setInList(true);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {error && <p className='error'>{error}</p>}
      <Link
        to='/bookdetails'
        className='book-detail-preview link-util'
        state={{
          book: props.book,
          url: url,
        }}
      >
        <div className='book'>
          <div className='title-container'>
            {/* check string.length and slice to whatever fits, add ... */}
            <p className='title'>
              {title.slice(0, 63)} {title.length >= 61 ? '...' : ''}
            </p>
            {parentComponent === 'booklist' && (
              <ReadStatus
                googleBooksId={googleBooksId}
                // inUsersBooks={inUsersBooks}
                id={id}
                hasRead={hasRead}
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
            {!loading && inList === false && (
              <button
                onClick={handleAddBookToDB}
                data-id={googleBooksId}
                className='search-btn'
                type='button'
              >
                Add Book
              </button>
            )}
            {!loading && inList && (
              <p className='book-in-list-msg'>This Book Is In Your List</p>
            )}
          </div>

          <div className='search-book-details'>
            <p>Author: {authors[0]}</p>
            <p>ISBN: {isbn}</p>
            <p>Publish Date: {publishedDate}</p>
            <p>Category: {categories[0].split('/')[0]}</p>
            <p>Page Count: {pageCount}</p>
          </div>
        </div>
      </Link>
    </>
  );
}
