import { Link } from 'react-router-dom';
import './BookDetailsPreview.css';
import { useEffect, useState, useContext } from 'react';
import { BookListContext } from '../context/BookListContext';
import ReadStatusUpdate from './ReadStatusUpdate.jsx';
import RingLoader from 'react-spinners/RingLoader';
import trash from '../assets/trash-icon.svg';

export default function BookDetailsPreviewUpdate(props) {
  const { url, book, setCurrentBooks } = props;

  const {
    title,
    authors,
    isbn,
    publishedDate,
    categories,
    pageCount,
    googleBooksId,
    _id: id,
  } = book._id;

  const hasRead = book.hasRead;

  const { bookList, setBookList } = useContext(BookListContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRemoveBookOnClick = async (e) => {
    e.preventDefault();

    // delete from db
    if (bookList.length > 0) {
      try {
        setLoading(true);
        const res = await fetch(`/api/v1/users/delete/${googleBooksId}`, {
          method: 'DELETE',
        });
        if (res.status === 204) {
          const updatedList = bookList.filter((book) => book._id?._id !== id);
          setBookList(updatedList);
          setError(null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (bookList.length === 0) {
      setCurrentBooks([]);
    }
  }, [bookList]);

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
            <ReadStatusUpdate
              googleBooksId={googleBooksId}
              id={id}
              hasRead={hasRead}
            />
            <p className='title'>{title}</p>
            {loading ? (
              <RingLoader
                size='18px'
                color='#c87274'
                loading={loading}
                className='ring-loader'
              />
            ) : (
              <img
                src={trash}
                className='btn-book-list-preview-remove'
                onClick={handleRemoveBookOnClick}
              ></img>
            )}
          </div>

          <div className='book-list-book-details'>
            <p className='author'>
              Author:{' '}
              {authors[0].length <= 20
                ? authors[0]
                : `${authors[0].split(' ')[0].split('')[0]}. ${
                    authors[0].split(' ')[authors[0].split(' ').length - 1]
                  }`}
            </p>
            <p className='hide-on-tablet'>ISBN: {isbn}</p>
            <p>Published: {publishedDate}</p>
            <p className='hide-on-mobile'>
              Category:{' '}
              {categories[0] === 'N/A'
                ? categories[0]
                : categories[0].split('/')[0].length < 20
                ? categories[0].split('/')[0]
                : `${categories[0].split('/')[0].slice(0, 20)}...`}
            </p>
            <p className='hide-on-mobile'>Page Count: {pageCount}</p>
          </div>
        </div>
      </Link>
    </>
  );
}
