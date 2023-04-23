import { useState } from 'react';
import './App.css';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account';
import BookList from './pages/BookList';
import BookDetails from './pages/BookDetails';
import AddBook from './pages/AddBook';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/account' element={<Account />} />
            <Route path='/booklist' element={<BookList />} />
            <Route path='/bookdetails' element={<BookDetails />} />
            <Route path='/addbook' element={<AddBook />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
