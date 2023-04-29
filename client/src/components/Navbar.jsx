import './Navbar.css';
import logo from '../assets/logo.svg';
import { NavLink, useNavigate } from 'react-router-dom';
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
          <NavLink to='/' className={({ isActive }) => (isActive ? '' : '')}>
            <img src={logo} alt='logo of book nook' />
            <h1 className='title-font logo-title'>Book Nook</h1>
          </NavLink>
        </div>
        <div className='links-container'>
          <ul>
            <li>
              {!isLoggedIn && (
                <>
                  <NavLink className='links' to={`${'/login'}`}>
                    Login
                  </NavLink>
                </>
              )}
              {isLoggedIn && (
                <>
                  <NavLink className='links' to='/booklist'>
                    My Book List
                  </NavLink>
                  <NavLink className='links' to='/addbook'>
                    Add Book
                  </NavLink>
                  <NavLink className='links' to='/account'>
                    Account
                  </NavLink>
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
                <NavLink className='links' to='/signup'>
                  Sign up
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
