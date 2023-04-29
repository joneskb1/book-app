import './AddBook.css';
import { useState, useEffect } from 'react';
import searchIcon from '../assets/search.svg';
import BookDetailsPreview from '../components/BookDetailsPreview';
import Paginate from '../components/Paginate';
import { useNavigate } from 'react-router-dom';

export default function AddBook() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('intitle');
  const [books, setBooks] = useState();
  const [error, setError] = useState(null);
  const [currentBooks, setCurrentBooks] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(5);
  // const [forceUpdate, setForceUpdate] = useState(false);

  // const navigate = useNavigate();

  useEffect(() => {
    if (books) {
      const indexOfLastBook = currentPage * booksPerPage;
      const indexOfFirstBook = indexOfLastBook - booksPerPage;
      setCurrentBooks(books.slice(indexOfFirstBook, indexOfLastBook));
    }
  }, [currentPage, books]);

  async function handleAddBookToDB(e) {
    e.preventDefault();

    try {
      const id = e.target.dataset.id;

      const res = await fetch(`/api/v1/books/${id}`, {
        method: 'POST',
      });

      const data = await res.json();

      if (data.status === 'success') {
        setError(null);
        // need to rerender or do something to show book was added to list
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    // may need to account for double spaces if google api doesn't
    const term = searchTerm.replaceAll(' ', '+');
    const res = await fetch(`/api/v1/books/findbook/${searchBy}/${term}`);
    const data = await res.json();
    setBooks(data.data.data);
    // add try catch
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
                  key={index}
                  book={book}
                  handleAddBookToDB={handleAddBookToDB}
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
            />
          )}
        </div>
      </div>
    </>
  );
}
