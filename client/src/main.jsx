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
// display book details
// add/remove book from user's list
// display and paginate the user's book list
// add reading/study timer
// filter / sort books
// mark read/unread
// error handling
