import '../pages/BookList.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Paginate from '../components/Paginate';
import BookDetailsPreview from '../components/BookDetailsPreview.jsx';
import useBooklist from '../hooks/useBooklist';
import FilterSortControls from './FilterSortControls';

export default function BookListOutput({ findCurrentItems }) {
  const [filterBy, setFilterBy] = useState(() =>
    localStorage.getItem('filter') ? localStorage.getItem('filter') : null
  );
  const [sortBy, setSortBy] = useState(() =>
    localStorage.getItem('sort') ? localStorage.getItem('sort') : null
  );
  const [loading, setLoading] = useState(true);
  const [currentBooks, setCurrentBooks] = useState();
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('bookListCurrentPage')
      ? Number.parseInt(localStorage.getItem('bookListCurrentPage'))
      : 1;
  });

  const [bookListEmpty, setBookListEmpty] = useState(() =>
    checkBookListEmpty()
  );
  const [error, setError] = useState(null);

  // const { data, isLoading, isError, isValidating } = useBooklist(
  //   filterBy,
  //   sortBy
  // );
  const [bookList, setBookList] = useState(null);

  const booksPerPage = 5;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        let url = `/api/v1/users/books`;

        if (filterBy != null || sortBy != null) {
          url += `?filterBy=${filterBy}&sort=${sortBy}`;
        }

        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [filterBy, sortBy, currentPage]);

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

  async function checkBookListEmpty() {
    setLoading(true);
    const res = await fetch('/api/v1/users/books');
    const data = await res.json();
    if (data?.data?.books.length === 0) {
      localStorage.removeItem('filter');
      localStorage.removeItem('sort');
      setLoading(false);
      return setBookListEmpty(true);
    }
    setLoading(false);
    return setBookListEmpty(false);
  }

  if (loading) {
    return 'Loading...';
  }

  if (bookListEmpty && currentBooks?.length < 1) {
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

  // supposed to only render when filtering or sorting with no matches
  if (bookList?.length === 0) {
    return (
      <div>
        <FilterSortControls
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <p>
          You don't have any books that meet those sorting or filtering criteria
        </p>
      </div>
    );
  }

  return (
    <>
      <FilterSortControls
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
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
    </>
  );
}
