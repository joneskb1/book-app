import './BookList.css';
import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import Paginate from './Paginate';
import BookListPreview from './BookListPreview.jsx';
import FilterSortControls from './FilterSortControls';
import { BookListContext } from '../context/BookListContext';
import RingLoader from 'react-spinners/RingLoader';

export default function BookList({ findCurrentItems }) {
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('bookListCurrentPage')
      ? Number.parseInt(localStorage.getItem('bookListCurrentPage'))
      : 1;
  });
  const [currentBooks, setCurrentBooks] = useState([]);

  const {
    bookList,
    filterBy,
    setFilterBy,
    sortBy,
    setSortBy,
    fetchLoader,
    fetchError,
  } = useContext(BookListContext);

  const booksPerPage = 5;

  // make sure currentPage is not outside the bounds of how many pages of books there are
  useEffect(() => {
    localStorage.setItem('bookListCurrentPage', currentPage);
    const numCurrentPages = Math.ceil(bookList?.length / booksPerPage);
    if (currentPage > numCurrentPages && currentPage > 1) {
      setCurrentPage((prevState) => prevState - 1);
    }
  }, [currentPage, bookList]);

  useEffect(() => {
    if (bookList) {
      const currentItems = findCurrentItems(
        currentPage,
        booksPerPage,
        bookList
      );
      setCurrentBooks(currentItems);
    }
  }, [bookList, currentPage]);

  if (fetchLoader) {
    return (
      <div className='loader'>
        <RingLoader size='125px' color='#c87274' loading={fetchLoader} />
      </div>
    );
  }

  if (
    !fetchLoader &&
    currentBooks?.length < 1 &&
    filterBy === '' &&
    sortBy === ''
  ) {
    return (
      <div>
        <p>
          There are currently no books in your list. Click the button below to
          go to the add book page:
        </p>
        <Link className='link' to='/addbook'>
          <button className='btn-util btn'>Add Book</button>
        </Link>
      </div>
    );
  }

  if (bookList?.length === 0 && filterBy !== null) {
    return (
      <div className='filter-sort-controls'>
        <FilterSortControls
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <p>You don't have any books that meet the filtering criteria</p>
      </div>
    );
  }

  if (fetchError) {
    return <p className='error'>{fetchError}</p>;
  }

  return (
    <>
      <FilterSortControls
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {!fetchLoader && currentBooks.length > 0 && (
        <div className='detail-container'>
          <p className='details'>
            Click book for details. Click checkbox to toggle book's read status.
          </p>
        </div>
      )}
      <div className='book-list-container'>
        {currentBooks &&
          currentBooks.map((book, index) => {
            return (
              <BookListPreview
                book={book}
                key={index}
                setCurrentBooks={setCurrentBooks}
                url='booklist'
              />
            );
          })}
      </div>

      {currentBooks && (
        <Paginate
          itemsPerPage={booksPerPage}
          items={bookList}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </>
  );
}
