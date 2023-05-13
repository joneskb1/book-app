import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// TODO:
//  TEST error handling
// add reading/study timer
// css polish/refactor/useFetch hook?
// only render book list components like paginate if the user actually has books, else give msg or link to addbook page
// extract checkLogin into a custom hook, use in context and then anywhere in the app you want to protect a route
