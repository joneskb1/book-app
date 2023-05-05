import { useState, useContext } from 'react';
import './App.css';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account';
import BookList from './pages/BookList';
import BookDetails from './pages/BookDetails';
import AddBook from './pages/AddBook';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import { AuthContext } from './context/AuthContext';

function App() {
  const { isLoggedIn } = useContext(AuthContext);

  const findCurrentItems = function (currentPage, itemsPerPage, items) {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  };

  return (
    <div className='App'>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route
              path='/reset-password-form/:token'
              element={<ResetPassword />}
            />

            <Route path='/forgot-password-form' element={<ForgotPassword />} />

            <Route
              path='/account'
              element={isLoggedIn ? <Account /> : <Navigate replace to={'/'} />}
            />
            <Route
              path='/booklist'
              element={
                isLoggedIn ? (
                  <BookList findCurrentItems={findCurrentItems} />
                ) : (
                  <Navigate replace to={'/'} />
                )
              }
            />
            <Route
              path='/bookdetails'
              element={
                isLoggedIn ? <BookDetails /> : <Navigate replace to={'/'} />
              }
            />
            <Route
              path='/addbook'
              element={
                isLoggedIn ? (
                  <AddBook findCurrentItems={findCurrentItems} />
                ) : (
                  <Navigate replace to={'/'} />
                )
              }
            />

            <Route path='*' element={<Navigate replace to={'/'} />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
