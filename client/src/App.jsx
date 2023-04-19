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
          </Routes>
          <Routes>
            <Route path='/login' element={<Login />} />
          </Routes>
          <Routes>
            <Route path='/signup' element={<Signup />} />
          </Routes>
          <Routes>
            <Route path='/account' element={<Account />} />
          </Routes>
          <Routes>
            <Route path='/booklist' element={<BookList />} />
          </Routes>
          <Routes>
            <Route path='/bookdetails' element={<BookDetails />} />
          </Routes>
          <Routes>
            <Route path='/addbook' element={<AddBook />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
