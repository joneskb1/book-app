import './AddBook.css';
import { useState, useEffect } from 'react';
import searchIcon from '../assets/search.svg';
import AddBookPreview from '../components/AddBookPreview';
import Paginate from '../components/Paginate';
import RingLoader from 'react-spinners/RingLoader';

export default function AddBook({ findCurrentItems }) {
  const [searchTerm, setSearchTerm] = useState(() =>
    localStorage.getItem('searchTerm') ? localStorage.getItem('searchTerm') : ''
  );
  const [searchBy, setSearchBy] = useState(() =>
    localStorage.getItem('searchBy')
      ? localStorage.getItem('searchBy')
      : 'intitle'
  );
  const [loading, setLoading] = useState(null);

  const [books, setBooks] = useState(null);
  const [error, setError] = useState(null);

  const [currentBooks, setCurrentBooks] = useState(null);
  const [currentPage, setCurrentPage] = useState(() =>
    localStorage.getItem('currentPage')
      ? Number.parseInt(localStorage.getItem('currentPage'), 10)
      : 1
  );
  const [addBookLoading, setAddBookLoading] = useState(false);

  const booksPerPage = 5;

  useEffect(() => {
    async function setPrevData() {
      if (searchTerm) {
        const lastCurrentPage = Number.parseInt(
          localStorage.getItem('currentPage')
        );
        await fetchFromGoogle();
        setCurrentPage(lastCurrentPage);
      }
    }

    setPrevData();
  }, []);

  useEffect(() => {
    if (books) {
      const currentItems = findCurrentItems(currentPage, booksPerPage, books);
      setCurrentBooks(currentItems);
    }
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage, books]);

  async function fetchFromGoogle() {
    localStorage.setItem('searchTerm', searchTerm);
    localStorage.setItem('searchBy', searchBy);
    try {
      setLoading(true);
      const term = searchTerm.replaceAll(' ', '+');
      const res = await fetch(`/api/v1/books/findbook/${searchBy}/${term}`);
      const data = await res.json();
      if (data.status === 'success') {
        setBooks(data.data.data);
        setError(null);
      } else {
        if (data.message) {
          setError('No results found with search term');
          setBooks([]);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    setCurrentPage(1);
    if (!searchTerm) {
      setBooks(null);
      setCurrentBooks(null);
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

          {loading && (
            <div className='loader'>
              <RingLoader size='125px' color='#c87274' loading={loading} />
            </div>
          )}
          {currentBooks?.length > 0 && !loading && (
            <p className='user-instructions'>Click book to see details</p>
          )}

          <div className='book-search-results-container'>
            {currentBooks &&
              !loading &&
              currentBooks.map((book, index) => {
                return (
                  <AddBookPreview
                    key={index}
                    book={book}
                    books={books}
                    setBooks={setBooks}
                    addBookLoading={addBookLoading}
                    setAddBookLoading={setAddBookLoading}
                    url='addbook'
                  />
                );
              })}
          </div>
          {currentBooks?.length > 0 && !loading && (
            <Paginate
              itemsPerPage={booksPerPage}
              items={books}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        </div>
      </div>
    </>
  );
}
