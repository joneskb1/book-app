import './AddBook.css';
import { Link, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { useState, useEffect } from 'react';
import closeX from '../assets/close-x.svg';
import searchIcon from '../assets/search.svg';
import arrowLeft from '../assets/arrow-left.svg';
import arrowRight from '../assets/arrow-right.svg';
import BookDetailsPreview from '../components/BookDetailsPreview';
import Paginate from '../components/Paginate';

export default function AddBook() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('intitle');
  const [books, setBooks] = useState();
  const [currentBooks, setCurrentBooks] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 5;
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;

  useEffect(() => {
    if (books) {
      setCurrentBooks(books.slice(indexOfFirstBook, indexOfLastBook));
    }
  }, [currentPage, books]);

  const handlePageChange = async (pageNum) => {
    setCurrentPage(pageNum);
  };

  const handlePageChangeArrow = (e) => {
    if (!currentBooks) return;

    if (
      e.currentTarget.className.includes('arrow-right') &&
      currentPage < books.length / booksPerPage
    ) {
      return setCurrentPage((prevState) => prevState + 1);
    }

    if (e.currentTarget.className.includes('arrow-left') && currentPage > 1) {
      return setCurrentPage((prevState) => prevState - 1);
    }
  };

  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate('/booklist');
    }
  };

  function handleAddBookToDB(e) {
    e.preventDefault();
    return;
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    // may need to account for double spaces if google api doesn't
    const term = searchTerm.replaceAll(' ', '+');

    const res = await fetch(`/api/v1/books/findbook/${searchBy}/${term}`);

    const data = await res.json();
    setBooks(data.data.data);
    setCurrentPage(1);
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
          <Link to='/booklist'>
            <img
              src={closeX}
              tabIndex='0'
              alt='close x'
              className='close-x'
              onKeyDown={handleKeyDown}
            />
          </Link>
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
                  props={book}
                  handleAddBookToDB={handleAddBookToDB}
                />
              );
            })}

          {currentBooks && (
            <div className='arrow-wrap'>
              <button
                className='btn-util arrow-left'
                onClick={handlePageChangeArrow}
                aria-label='left arrow'
              >
                <img src={arrowLeft} className='arrow' />
              </button>
              <Paginate
                itemsPerPage={booksPerPage}
                totalItems={40}
                handlePageChange={handlePageChange}
                currentPage={currentPage}
              />
              <button
                className='btn-util arrow-right'
                onClick={handlePageChangeArrow}
                aria-label='right arrow'
              >
                <img src={arrowRight} className='arrow' />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
