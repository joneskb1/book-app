import { Link } from 'react-router-dom';
import './AddBookPreview.css';
import { useState, useContext } from 'react';
import { BookListContext } from '../context/BookListContext';
import RingLoader from 'react-spinners/RingLoader';

export default function AddBookPreview(props) {
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
        to='/book-details'
        className='book-detail-preview-search link-util'
        state={{
          book: book,
          url: url,
        }}
      >
        <div className='book'>
          <div className='title-container'>
            <p className='title'>
              {title.slice(0, 63)} {title.length >= 61 ? '...' : ''}
            </p>

            {loading && (
              <RingLoader
                size='20px'
                color='#c87274'
                loading={loading}
                className='ring-loader'
              />
            )}

            {!loading && !inList && (
              <button
                onClick={handleAddBookToDB}
                data-id={googleBooksId}
                className='add-book-btn'
                type='button'
                disabled={addBookLoading}
              >
                Add Book
              </button>
            )}

            {!loading && inList && (
              <div className='in-list-container'>
                <p className='book-in-list-msg'>
                  In book list{' '}
                  <span className='book-list-check-mark'>&#x2713;</span>
                </p>
              </div>
            )}
          </div>

          <div className='search-book-details'>
            <p className='author'>
              Author:
              {authors[0].length <= 20
                ? ` ${authors[0]}`
                : ` ${authors[0].split(' ')[0].split('')[0]}. ${
                    authors[0].split(' ')[authors[0].split(' ').length - 1]
                  }`}
            </p>
            <p className='hide-on-tablet'>ISBN: {isbn}</p>
            <p>Publish Date: {publishedDate}</p>
            <p className='hide-on-mobile'>
              Category: {categories[0].split('/')[0]}
            </p>
            <p className='hide-on-mobile'>Page Count: {pageCount}</p>
          </div>
        </div>
      </Link>
    </>
  );
}
