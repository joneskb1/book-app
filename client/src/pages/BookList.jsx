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
    localStorage.getItem('filter') ? localStorage.getItem('filter') : 'null'
  );
  const [sortBy, setSortBy] = useState(() =>
    localStorage.getItem('sort') ? localStorage.getItem('sort') : 'null'
  );

  const [currentPage, setCurrentPage] = useState(() =>
    localStorage.getItem('bookListCurrentPage')
      ? Number.parseInt(localStorage.getItem('bookListCurrentPage'))
      : 1
  );

  const [booksPerPage] = useState(5);
  const [currentBooks, setCurrentBooks] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        let url;
        if (filterBy != 'null' || sortBy != 'null') {
          url = `/api/v1/users/books?filterBy=${filterBy}&sort=${sortBy}`;
          localStorage.setItem('filter', filterBy);
          localStorage.setItem('sort', sortBy);
        } else {
          console.log('fetching w/o filter');

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
        // is this redundant???
        // setCurrentPage(currentPage);
      }
    }
  }, [bookList, currentPage, filterBy, sortBy]);

  useEffect(() => {
    localStorage.setItem('bookListCurrentPage', currentPage);
  }, [currentPage]);

  return (
    <>
      <div className='booklist'>
        <div className='container'>
          <h2 className='title'>Book List</h2>

          {currentBooks === null ? (
            ''
          ) : currentBooks?.length > 0 ? (
            <div>
              {error && <p>{error}</p>}
              <div className='filter-sort-container'>
                <p className='filter-label'>Filter:</p>
                <button
                  className={`read-btn ${filterBy === 'read' ? 'active' : ''}`}
                  onClick={() =>
                    filterBy === 'read'
                      ? setFilterBy('null')
                      : setFilterBy('read')
                  }
                >
                  Read
                </button>
                <button
                  className={`unread-btn ${
                    filterBy === 'unread' ? 'active' : ''
                  }`}
                  onClick={() =>
                    filterBy === 'unread'
                      ? setFilterBy('null')
                      : setFilterBy('unread')
                  }
                >
                  Unread
                </button>
                <p className='sort-label'>Sort:</p>
                <button
                  className={`title-btn ${sortBy === 'title' ? 'active' : ''}`}
                  onClick={() =>
                    sortBy === 'title' ? setSortBy('null') : setSortBy('title')
                  }
                >
                  Title
                </button>
                <button
                  className={`author-btn ${
                    sortBy === 'author' ? 'active' : ''
                  }`}
                  onClick={() =>
                    sortBy === 'author'
                      ? setSortBy('null')
                      : setSortBy('author')
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
          ) : bookList.length === 0 &&
            (filterBy !== 'null' || sortBy !== 'null') ? (
            <div>
              <div className='filter-sort-container'>
                <p className='filter-label'>Filter:</p>
                <button
                  className={`read-btn ${filterBy === 'read' ? 'active' : ''}`}
                  onClick={() =>
                    filterBy === 'read'
                      ? setFilterBy('null')
                      : setFilterBy('read')
                  }
                >
                  Read
                </button>
                <button
                  className={`unread-btn ${
                    filterBy === 'unread' ? 'active' : ''
                  }`}
                  onClick={() =>
                    filterBy === 'unread'
                      ? setFilterBy('null')
                      : setFilterBy('unread')
                  }
                >
                  Unread
                </button>
                <p className='sort-label'>Sort:</p>
                <button
                  className={`title-btn ${sortBy === 'title' ? 'active' : ''}`}
                  onClick={() =>
                    sortBy === 'title' ? setSortBy('null') : setSortBy('title')
                  }
                >
                  Title
                </button>
                <button
                  className={`author-btn ${
                    sortBy === 'author' ? 'active' : ''
                  }`}
                  onClick={() =>
                    sortBy === 'author'
                      ? setSortBy('null')
                      : setSortBy('author')
                  }
                >
                  Author
                </button>
              </div>
              <p>
                You don't have any books that meet those sorting or filtering
                criteria
              </p>
            </div>
          ) : (
            <div>
              <p>
                There are currently no books in your list. Click the button
                below to go to the add book page:
              </p>
              <Link className='link' to='/addbook'>
                <button className='btn-util btn'>Add Book Page</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
