import './BookList.css';
import greenCheck from '../assets/green-check.svg';
import unreadX from '../assets/unread-x.svg';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useContext, useEffect, useState } from 'react';

export default function BookList() {
  const [bookList, setBookList] = useState(null);
  const [error, setError] = useState(null);
  const [filterBy, setFilterBy] = useState(null);
  const [sortBy, setSortBy] = useState(null);

  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const url = `/api/v1/users/books`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.status === 'success') {
          setBookList(data.data.books);
          setError(null);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const url = `/api/v1/users/books?filterBy=${filterBy}&sort=${sortBy}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.status === 'success') {
          setBookList(data.data.books);
          setError(null);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBooks();
  }, [filterBy, sortBy]);

  return (
    <>
      <div className='booklist'>
        <div className='container'>
          <h2 className='title'>Book List</h2>
          <div className='filter-sort-container'>
            <p className='filter-label'>Filter:</p>
            <button
              className={`read-btn ${filterBy === 'read' ? 'active' : ''}`}
              onClick={() =>
                filterBy === 'read' ? setFilterBy(null) : setFilterBy('read')
              }
            >
              Read
            </button>
            <button
              className={`unread-btn ${filterBy === 'unread' ? 'active' : ''}`}
              onClick={() =>
                filterBy === 'unread'
                  ? setFilterBy(null)
                  : setFilterBy('unread')
              }
            >
              Unread
            </button>
            <p className='sort-label'>Sort:</p>
            <button
              className={`title-btn ${sortBy === 'title' ? 'active' : ''}`}
              onClick={() =>
                sortBy === 'title' ? setSortBy(null) : setSortBy('title')
              }
            >
              Title
            </button>
            <button
              className={`author-btn ${sortBy === 'author' ? 'active' : ''}`}
              onClick={() =>
                sortBy === 'author' ? setSortBy(null) : setSortBy('author')
              }
            >
              Author
            </button>
          </div>
          <div className='detail-container'>
            <p className='details'>Click book for details</p>
            <p className='read-status'>Read Status</p>
          </div>
          {bookList &&
            bookList.map((book, index) => {
              return (
                <Link
                  className='book-link'
                  to={`/bookdetails`}
                  state={{ book }}
                  key={index}
                >
                  <div className='book'>
                    <p>
                      {book._id.title}, by {book._id.authors[0]}
                    </p>
                    <img
                      src={book.hasRead ? greenCheck : unreadX}
                      alt={book.hasRead ? 'read check' : 'unread check'}
                    />
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </>
  );
}
