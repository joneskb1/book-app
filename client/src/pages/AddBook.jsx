import './AddBook.css';
import { useState, useEffect } from 'react';
import searchIcon from '../assets/search.svg';
import BookDetailsPreview from '../components/BookDetailsPreview';
import Paginate from '../components/Paginate';

export default function AddBook() {
  const [searchTerm, setSearchTerm] = useState(() =>
    localStorage.getItem('searchTerm') ? localStorage.getItem('searchTerm') : ''
  );
  const [searchBy, setSearchBy] = useState(() =>
    localStorage.getItem('searchBy')
      ? localStorage.getItem('searchBy')
      : 'intitle'
  );
  const [books, setBooks] = useState();
  const [error, setError] = useState(null);
  const [currentBooks, setCurrentBooks] = useState();
  const [currentPage, setCurrentPage] = useState(() =>
    localStorage.getItem('currentPage')
      ? localStorage.getItem('currentPage')
      : 1
  );
  const [loading, setLoading] = useState();
  const [booksPerPage] = useState(5);

  useEffect(() => {
    async function searchWithPrevData() {
      const lastCurrentPage = localStorage.getItem('currentPage');

      if (searchTerm) {
        await fetchFromGoogle();
        setCurrentPage(lastCurrentPage);
      }
    }

    searchWithPrevData();
  }, []);

  useEffect(() => {
    if (books) {
      const indexOfLastBook = currentPage * booksPerPage;
      const indexOfFirstBook = indexOfLastBook - booksPerPage;
      setCurrentBooks(books.slice(indexOfFirstBook, indexOfLastBook));
    }
  }, [currentPage, books]);

  async function handleAddBookToDB(e) {
    e.preventDefault();

    const id = e.target.dataset.id;
    try {
      setLoading({ [id]: true });
      const res = await fetch(`/api/v1/books/${id}`, {
        method: 'POST',
      });

      const data = await res.json();

      if (data.status === 'success') {
        setError(null);
        await fetchFromGoogle();
        setCurrentPage(currentPage);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading({ [id]: false });
    }
  }

  async function fetchFromGoogle() {
    localStorage.setItem('searchTerm', searchTerm);
    localStorage.setItem('searchBy', searchBy);

    try {
      const term = searchTerm.replaceAll(' ', '+');
      const res = await fetch(`/api/v1/books/findbook/${searchBy}/${term}`);
      const data = await res.json();
      if (data.status === 'success') {
        setBooks(data.data.data);
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    if (!searchTerm) {
      setBooks(null);
      setCurrentBooks(null);
      setCurrentPage(1);
      localStorage.clear();
      return;
    }
    await fetchFromGoogle();
  }

  const handleRadioChange = (event) => {
    setSearchBy(event.target.value);
  };

  return (
    <>
      <div className='add-book'>
        <div className='container'>
          <div className='header'>Add Book</div>
          {error && <p className='error'>{error}</p>}

          <form onSubmit={handleFormSubmit} className='search-form'>
            <div className='radio-btns-search-bar-wrap'>
              <fieldset className='fieldset'>
                <div className='radio-legend-wrap'>
                  <legend className='legend'>Search by:</legend>
                  <div className='radio-wrap'>
                    <input
                      type='radio'
                      id='intitle'
                      name='search-by'
                      value='intitle'
                      className='radio-input'
                      checked={searchBy === 'intitle'}
                      onChange={handleRadioChange}
                    />
                    <label htmlFor='intitle' className='radio-label'>
                      Title
                    </label>
                    <input
                      type='radio'
                      id='inauthor'
                      name='search-by'
                      value='inauthor'
                      className='radio-input'
                      checked={searchBy === 'inauthor'}
                      onChange={handleRadioChange}
                    />
                    <label htmlFor='inauthor' className='radio-label'>
                      Author
                    </label>
                    <input
                      type='radio'
                      id='isbn'
                      name='search-by'
                      value='isbn'
                      className='radio-input'
                      checked={searchBy === 'isbn'}
                      onChange={handleRadioChange}
                    />
                    <label htmlFor='isbn' className='radio-label'>
                      ISBN
                    </label>
                  </div>
                </div>
              </fieldset>
              <label htmlFor='search-term' className='visually-hidden'>
                Search
              </label>
              <input
                className='input'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                name='searchTerm'
                type='text'
                id='search-term'
                placeholder='Search'
                aria-label='Search'
              />
            </div>

            <button className='btn' aria-label='Search'>
              <img src={searchIcon} alt='Search' className='search-icon' />
            </button>
          </form>
          {currentBooks && (
            <p className='user-instructions'>Click book to see details</p>
          )}

          {currentBooks &&
            currentBooks.map((book, index) => {
              return (
                <BookDetailsPreview
                  url='addbook'
                  key={index}
                  book={book}
                  handleAddBookToDB={handleAddBookToDB}
                  loading={!!loading && !!loading[book.googleBooksId]}
                />
              );
            })}
          {currentBooks && (
            <Paginate
              itemsPerPage={booksPerPage}
              totalItems={books?.length > 0 ? books.length : 0}
              currentPage={currentPage}
              currentBooks={currentBooks}
              books={books}
              booksPerPage={booksPerPage}
              setCurrentPage={setCurrentPage}
              parent='googlesBooks'
            />
          )}
        </div>
      </div>
    </>
  );
}
