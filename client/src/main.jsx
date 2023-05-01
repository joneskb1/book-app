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
// user updates: name, email, pw & forgot password email
// add reading/study timer
// interactive read/unread
// error handling
// working on passing hasRead prop from findBook function to the book details page
//  bookdetails error
// save state on my book list page
