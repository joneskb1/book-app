import './BookDetails.css';

import closeX from '../assets/close-x.svg';
import noImage from '../assets/no-image.svg';
import ReadStatusUpdate from '../components/ReadStatusUpdate.jsx';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useContext } from 'react';
import { BookListContext } from '../context/BookListContext';
import RingLoader from 'react-spinners/RingLoader';

export default function BookDetailsUpdate() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { bookList, setBookList, fetchLoader } = useContext(BookListContext);
  let { book, url } = location.state;

  console.log(url);

  const bookData = book._id ? book._id : book;

  let hasRead, inList;
  if (bookList) {
    const bookId = book._id?._id ? book._id?._id : book.googleBooksId;
    const updatedBook = bookList.find((userBook) => {
      // if book coming from booklist it will have ._id._id
      const bookListBookId = book._id?._id
        ? userBook._id?._id
        : userBook._id.googleBooksId;

      return bookListBookId === bookId;
    });
    hasRead = updatedBook?.hasRead;
    inList = updatedBook !== undefined;
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (url === 'booklist') {
        navigate('/booklist');
      } else if (url === 'addbook') {
        navigate('/addbook');
      }
    }
  };

  async function handleRemoveClick(e) {
    setLoading(true);
    const id = e.target.dataset.id;
    try {
      const res = await fetch(`/api/v1/users/delete/${id}`, {
        method: 'DELETE',
      });
      if (res.status === 204) {
        const updatedList = bookList.filter(
          (book) => book._id.googleBooksId !== id
        );
        setBookList(updatedList);
        setError(null);
      }
    } catch (error) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddClick(e) {
    try {
      setLoading(true);
      const id = e.target.dataset.id;
      const res = await fetch(`/api/v1/books/${id}`, {
        method: 'POST',
      });

      const data = await res.json();

      if (data.status === 'success') {
        setError(null);
        setBookList(data.data.user.books);
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
      <div className='book-details'>
        <div className='container'>
          <div className='title-close-btn-container'>
            <h2 className='details-header'>Book Details</h2>
            <div className='btn-close'>
              <Link to={url === 'booklist' ? '/booklist' : '/addbook'}>
                <img
                  src={closeX}
                  tabIndex='0'
                  alt='close x'
                  className='close-x'
                  onKeyDown={handleKeyDown}
                />
              </Link>
            </div>
          </div>
          {error && <p>{error}</p>}
          {bookData && (
            <div className='book-info'>
              <h3 className='details-title'>Title: {bookData.title}</h3>

              <img
                className='book-image'
                src={
                  bookData.imageLinks?.thumbnail === 'N/A'
                    ? noImage
                    : bookData.imageLinks?.thumbnail
                }
                alt='cover of book'
              />

              <p className='book-detail-p google-rating'>
                Google Book's Rating {bookData.avgGoogleBooksRating} (
                {bookData.googleBooksRatingsCount} reviews)
              </p>
              <p className='book-detail-p authors'>
                Author:{' '}
                {typeof bookData.authors === 'string'
                  ? bookData.authors
                  : bookData.authors.join(', ')}
              </p>
              <p className='book-detail-p summary'>{bookData.description}</p>
              <p className='book-detail-p isbn'>ISBN: {bookData.isbn}</p>
              <p className='book-detail-p category'>
                Category:{' '}
                {typeof bookData.categories === 'string'
                  ? bookData.categories
                  : bookData.categories.join(', ')}
              </p>

              <p className='book-detail-p'>
                Number of Pages: {bookData.pageCount}
              </p>
              <p className='book-detail-p'>Publisher: {bookData.publisher}</p>
              <p className='book-detail-p'>
                Date of Publication: {bookData.publishedDate}
              </p>

              {!loading && inList && (
                <div className='read-status-wrap'>
                  <p className='book-detail-p read-status-wrap-p'>
                    Read Status:{' '}
                  </p>
                  <ReadStatusUpdate
                    googleBooksId={bookData.googleBooksId}
                    hasRead={hasRead}
                  />
                </div>
              )}

              {loading || fetchLoader ? (
                <RingLoader
                  size='20px'
                  color='#c87274'
                  loading={loading || fetchLoader}
                />
              ) : inList ? (
                <button
                  className='btn  btn-util'
                  data-id={bookData.googleBooksId}
                  onClick={handleRemoveClick}
                >
                  Remove Book
                </button>
              ) : (
                <button
                  className='btn  btn-util'
                  data-id={bookData.googleBooksId}
                  onClick={handleAddClick}
                >
                  Add Book
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
