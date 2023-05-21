import './Navbar.css';
import logo from '../assets/logo.svg';
import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigation = useNavigate();

  const handleLogout = async () => {
    if (isLoggedIn) {
      const res = await fetch('/api/v1/users/logout');
      const data = await res.json();
      setIsLoggedIn(false);
      localStorage.clear();
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
            {!isLoggedIn && (
              <>
                {' '}
                <li>
                  <NavLink className='links' to={`${'/login'}`}>
                    Login
                  </NavLink>{' '}
                </li>
                <li>
                  <NavLink className='links' to='/signup'>
                    Sign up
                  </NavLink>
                </li>
              </>
            )}

            {isLoggedIn && (
              <>
                <li>
                  <NavLink className='links' to='/booklist'>
                    My Book List
                  </NavLink>
                </li>

                <li>
                  <NavLink className='links' to='/addbook'>
                    Add Book
                  </NavLink>
                </li>
                <li>
                  <NavLink className='links' to='/account'>
                    Account
                  </NavLink>
                </li>
                <button className='btn-util btn-logout' onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}
