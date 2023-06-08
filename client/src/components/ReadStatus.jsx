import readIcon from '../assets/green-check.svg';
import unreadIcon from '../assets/gray-check.svg';
import './ReadStatus.css';
import { useState, useContext } from 'react';
import { BookListContext } from '../context/BookListContext';
import RingLoader from 'react-spinners/RingLoader';

export default function ReadStatus({ googleBooksId, hasRead }) {
  const [error, setError] = useState(null);
  const { bookList, setBookList } = useContext(BookListContext);
  const [loading, setLoading] = useState(null);

  const hasReadStatus = hasRead;

  const updateListReadStatus = () => {
    const updatedList = bookList.map((book) => {
      if (book._id.googleBooksId === googleBooksId) {
        return { ...book, hasRead: !book.hasRead };
      }
      return book;
    });
    setBookList(updatedList);
  };

  function handleReadTab(e) {
    if (e.key !== 'Enter') return;
    handleReadToggle(e);
  }

  async function handleReadToggle(e) {
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
      {loading && <RingLoader size='18px' color='#c87274' loading={loading} />}
      {!error && !loading && (
        <img
          onClick={handleReadToggle}
          onKeyDown={handleReadTab}
          className='read-status-icon'
          src={hasReadStatus === true ? readIcon : unreadIcon}
          alt={`${hasReadStatus === true ? 'read' : 'unread'}`}
          tabIndex='0'
        />
      )}
    </>
  );
}
