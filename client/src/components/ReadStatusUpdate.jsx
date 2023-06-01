import readIcon from '../assets/green-check.svg';
import unreadIcon from '../assets/unread-x.svg';
import './ReadStatusUpdate.css';
import { useState, useContext } from 'react';
import { BookListContext } from '../context/BookListContext';
import RingLoader from 'react-spinners/RingLoader';

export default function ReadStatusUpdate({ googleBooksId, id, hasRead }) {
  const [error, setError] = useState(null);
  const { bookList, setBookList } = useContext(BookListContext);
  const [loading, setLoading] = useState(null);

  const hasReadStatus = hasRead;

  // make hook to reuse in detail page
  const updateListReadStatus = () => {
    const updatedList = bookList.map((book) => {
      //this doesn't work on the details page
      // const identifier = id ? id : googleBooksId;
      // const bookId = book._id?._id ? book._id?._id : book.googleBooksId;
      if (book._id.googleBooksId === googleBooksId) {
        return { ...book, hasRead: !book.hasRead };
      }
      return book;
    });
    setBookList(updatedList);
  };

  async function handleReadClick(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const url = `/api/v1/users/toggle-read/${googleBooksId}`;
      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json',
        },
      });

      const data = await res.json();

      if (data.status === 'success') {
        setError(null);
        updateListReadStatus();
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
      {' '}
      {error && <p className='error'>{error}</p>}
      {loading && <RingLoader size='20px' color='#c87274' loading={loading} />}
      {!error && !loading && (
        <img
          onClick={handleReadClick}
          src={hasReadStatus === true ? readIcon : unreadIcon}
          alt={`${hasReadStatus === true ? 'read' : 'unread'}`}
        />
      )}
    </>
  );
}
