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
// add reading/study timer
// css polish- sometimes the photos and text over lap on details page. sometimes text spills out
// add book loader
// clean code/refactor
// useFetch hook?

// BUGS/ISSUES:
// update state on book list page change instead of refetching data every time. maybe do same for details page?
