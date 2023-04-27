import './Navbar.css';
import logo from '../assets/logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { isLoggedIn, toggleLoggedIn } = useContext(AuthContext);
  const navigation = useNavigate();

  const handleLogout = async () => {
    if (isLoggedIn) {
      const res = await fetch('/api/v1/users/logout');
      const data = await res.json();
      toggleLoggedIn();
      navigation('/');
    }
  };

  return (
    <>
      <nav className='navbar'>
        <div className='logo-container'>
          <Link to='/'>
            <img src={logo} alt='logo of book nook' />
            <h1 className='title-font logo-title'>Book Nook</h1>
          </Link>
        </div>
        <div className='links-container'>
          <ul>
            <li>
              {!isLoggedIn && (
                <>
                  <Link className='links' to={`${'/login'}`}>
                    Login
                  </Link>
                </>
              )}
              {isLoggedIn && (
                <>
                  <Link className='links' to='/booklist'>
                    My Book List
                  </Link>
                  <Link className='links' to='/addbook'>
                    Add Book
                  </Link>
                  <Link className='links' to='/account'>
                    Account
                  </Link>
                  <button
                    className='btn-util btn-logout'
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              )}
            </li>

            <li>
              {isLoggedIn ? (
                ''
              ) : (
                <Link className='links' to='/signup'>
                  Sign up
                </Link>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
