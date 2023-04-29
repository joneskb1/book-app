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
// conditionally render add book btn when adding book from book details page and book previews. if they have it replace add book btn with msg telling them already have it in their list
// maintain book preview results when leaving book details page
// make all book previews the same. on add book and my book list.
// add book on BookDetailsPreview does add book but we need to change the add book button to the user message when they click on it.
// refactor pagination calculation into it's own function
//
