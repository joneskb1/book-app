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
import Protect from './components/Protect';
import PrivateRoute from './components/PrivateRoute';

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
            <Route
              path='/login'
              element={
                !isLoggedIn ? <Login /> : <Navigate replace to={'/booklist'} />
              }
            />
            <Route
              path='/signup'
              element={
                !isLoggedIn ? <Signup /> : <Navigate replace to={'/booklist'} />
              }
            />
            <Route
              path='/reset-password-form/:token'
              element={<ResetPassword />}
            />

            <Route path='/forgot-password-form' element={<ForgotPassword />} />

            <Route
              path='/account'
              element={
                <PrivateRoute key={1}>
                  <Account />
                </PrivateRoute>
              }
            />

            <Route
              path='/booklist'
              element={
                <PrivateRoute key={2}>
                  <BookList findCurrentItems={findCurrentItems} />
                </PrivateRoute>
              }
            />
            <Route
              path='/bookdetails'
              element={
                <PrivateRoute key={3}>
                  <BookDetails />
                </PrivateRoute>
              }
            />
            <Route
              path='/addbook'
              element={
                <PrivateRoute key={4}>
                  <AddBook findCurrentItems={findCurrentItems} />
                </PrivateRoute>
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
