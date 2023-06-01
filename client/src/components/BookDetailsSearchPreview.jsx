import { Link } from 'react-router-dom';
import './BookDetailsPreview.css';
import { useState, useContext } from 'react';
import { BookListContext } from '../context/BookListContext';
import RingLoader from 'react-spinners/RingLoader';

export default function BookDetailsSearchPreview(props) {
  const { url, book, addBookLoading, setAddBookLoading } = props;

  const {
    title,
    authors,
    isbn,
    publishedDate,
    categories,
    pageCount,
    googleBooksId,
  } = book;

  const { bookList, setBookList } = useContext(BookListContext);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const usersBook = bookList.find(
    (userBook) => userBook._id.googleBooksId === book.googleBooksId
  );
  const inList = usersBook !== undefined;

  async function handleAddBookToDB(e) {
    e.preventDefault();

    const id = e.target.dataset.id;
    try {
      setLoading(true);
      setAddBookLoading(true);
      const res = await fetch(`/api/v1/books/${id}`, {
        method: 'POST',
      });

      const data = await res.json();

      if (data.status === 'success') {
        setError(null);
        setBookList([...bookList, { ...data.data.newBookAdded }]);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setAddBookLoading(false);
    }
  }
  return (
    <>
      {error && <p className='error'>{error}</p>}
      <Link
        to='/book-details-update'
        className='book-detail-preview link-util'
        state={{
          book: book,
          url: url,
        }}
      >
        <div className='book'>
          <div className='title-container'>
            {/* check string.length and slice to whatever fits, add ... */}
            <p className='title'>
              {title.slice(0, 63)} {title.length >= 61 ? '...' : ''}
            </p>

            {loading && (
              <RingLoader size='20px' color='#c87274' loading={loading} />
            )}

            {!loading && !inList && (
              <button
                onClick={handleAddBookToDB}
                data-id={googleBooksId}
                className='search-btn'
                type='button'
                disabled={addBookLoading}
              >
                Add Book
              </button>
            )}

            {!loading && inList && (
              <p className='book-in-list-msg'>This Book Is In Your List</p>
            )}
          </div>

          <div className='search-book-details'>
            <p className='author'>Author: {authors[0]}</p>
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
