import React, { createContext, useEffect, useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';

const BookListContext = createContext();

function BookListProvider(props) {
  const [bookList, setBookList] = useState([]);
  const [filterBy, setFilterBy] = useState(() =>
    localStorage.getItem('filter') ? localStorage.getItem('filter') : ''
  );
  const [sortBy, setSortBy] = useState(() =>
    localStorage.getItem('sort') ? localStorage.getItem('sort') : ''
  );

  const [fetchLoader, setFetchLoader] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const { isLoggedIn } = useContext(AuthContext);

  let url = `/api/v1/users/books`;

  const fetch = async () => {
    try {
      setFetchLoader(true);
      const res = await axios.get(url);
      const data = res.data;
      if (data.status === 'success') {
        setBookList(data.data.books);
        setFetchError(null);
      } else {
        setFetchError(data.message);
      }
    } catch (error) {
      setFetchError(error.message);
    } finally {
      setFetchLoader(false);
    }
  };

  useEffect(() => {
    if (filterBy != '' || sortBy != '') {
      url += `?filterBy=${filterBy}&sort=${sortBy}`;
    }

    if (isLoggedIn) {
      fetch();
    }

    if (isLoggedIn == false) {
      setBookList([]);
    }
  }, [filterBy, sortBy, isLoggedIn]);

  const values = {
    bookList,
    setBookList,
    filterBy,
    setFilterBy,
    sortBy,
    setSortBy,
    fetchLoader,
    fetchError,
  };

  return (
    <BookListContext.Provider value={values}>
      {props.children}
    </BookListContext.Provider>
  );
}

export { BookListContext, BookListProvider };
