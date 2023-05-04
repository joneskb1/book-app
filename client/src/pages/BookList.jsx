import './BookList.css';
import greenCheck from '../assets/green-check.svg';
import unreadX from '../assets/unread-x.svg';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Paginate from '../components/Paginate';
import BookDetailsPreview from '../components/BookDetailsPreview.jsx';

export default function BookList({ findCurrentItems }) {
  const [bookList, setBookList] = useState(null);
  const [error, setError] = useState(null);
  const [filterBy, setFilterBy] = useState(() =>
    localStorage.getItem('filter') ? localStorage.getItem('filter') : null
  );
  const [sortBy, setSortBy] = useState(() =>
    localStorage.getItem('sort') ? localStorage.getItem('sort') : null
  );

  const [currentPage, setCurrentPage] = useState(() =>
    localStorage.getItem('bookListCurrentPage')
      ? Number.parseInt(localStorage.getItem('bookListCurrentPage'))
      : 1
  );

  const [booksPerPage] = useState(5);
  const [currentBooks, setCurrentBooks] = useState();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        let url;
        if (filterBy || sortBy) {
          url = `/api/v1/users/books?filterBy=${filterBy}&sort=${sortBy}`;
          localStorage.setItem('filter', filterBy);
          localStorage.setItem('sort', sortBy);
        } else {
          url = `/api/v1/users/books`;
          localStorage.setItem('filter', null);
          localStorage.setItem('sort', null);
        }

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
  }, [filterBy, sortBy]);

  useEffect(() => {
    if (bookList) {
      const currentItems = findCurrentItems(
        currentPage,
        booksPerPage,
        bookList
      );

      setCurrentBooks(currentItems);

      if (filterBy || sortBy) {
        if (currentPage > Math.ceil(bookList.length / booksPerPage)) {
          return setCurrentPage(1);
        }
        setCurrentPage(currentPage);
      }
    }
  }, [bookList, currentPage]);

  useEffect(() => {
    localStorage.setItem('bookListCurrentPage', currentPage);
  }, [currentPage]);

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
              items={bookList}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        </div>
      </div>
    </>
  );
}
