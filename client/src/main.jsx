import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { BookListProvider } from './context/BookListContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BookListProvider>
        <App />
      </BookListProvider>
    </AuthProvider>
  </React.StrictMode>
);

// TODO:
// add reading/study timer
// clean code/refactor
// cleanup back end unused code
