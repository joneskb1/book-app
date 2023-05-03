import './BookList.css';
import greenCheck from '../assets/green-check.svg';
import unreadX from '../assets/unread-x.svg';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Paginate from '../components/Paginate';
import BookDetailsPreview from '../components/BookDetailsPreview.jsx';

export default function BookList() {
  const [bookList, setBookList] = useState(null);
  const [error, setError] = useState(null);
  const [filterBy, setFilterBy] = useState(null);
  const [sortBy, setSortBy] = useState(null);

  const [currentPage, setCurrentPage] = useState(() =>
    localStorage.getItem('bookListCurrentPage')
      ? localStorage.getItem('bookListCurrentPage')
      : 1
  );

  const [booksPerPage] = useState(5);
  const [currentBooks, setCurrentBooks] = useState();

  useEffect(() => {
    if (bookList) {
      const indexOfLastBook = currentPage * booksPerPage;
      const indexOfFirstBook = indexOfLastBook - booksPerPage;
      setCurrentBooks(bookList.slice(indexOfFirstBook, indexOfLastBook));
    }
    // move setItems to here???
    // booklist needed in dependency?
  }, [currentPage, bookList]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const url = `/api/v1/users/books`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.status === 'success') {
          setBookList(data.data.books);
          setError(null);
        } else {
          // maybe throw data.message into catch block
          setError(data.message);
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
          if (filterBy || sortBy) {
            setCurrentPage(1);
          }
          setError(null);
        } else {
          setError(data.message);
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
          {error && <p>{error}</p>}
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
          {currentBooks &&
            currentBooks.map((book, index) => {
              return (
                <BookDetailsPreview
                  url='booklist'
                  hasRead={book.hasRead}
                  book={book._id}
                  key={index}
                />
              );
            })}
          {currentBooks && (
            <Paginate
              itemsPerPage={booksPerPage}
              totalItems={bookList?.length > 0 ? bookList.length : 0}
              currentPage={currentPage}
              currentBooks={currentBooks}
              books={bookList}
              setCurrentPage={setCurrentPage}
              parent='usersBooks'
            />
          )}
        </div>
      </div>
    </>
  );
}
