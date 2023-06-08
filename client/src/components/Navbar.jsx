import './Navbar.css';
import logo from '../assets/logo.svg';
import hamburgerIcon from '../assets/hamburger-icon-menu.svg';

import { NavLink, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';

import Dialog from './Dialog';

export default function Navbar() {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const [modalOpen, setModalOpen] = useState(false);

  const modalRef = useRef(null);

  const navigation = useNavigate();

  const handleLogout = async () => {
    if (isLoggedIn) {
      const res = await fetch('/api/v1/users/logout');
      setIsLoggedIn(false);
      localStorage.clear();
      navigation('/');
    }
  };

  const handleToggleModal = () => {
    setModalOpen((prevState) => !prevState);
  };

  const handleCloseModalClick = () => {
    const dialog = modalRef.current;
    dialog.close();
    handleToggleModal();
  };

  useEffect(() => {
    if (modalOpen) {
      const dialog = modalRef.current;
      dialog.showModal();
    }
    console.log(modalOpen);
  }, [modalOpen]);

  return (
    <>
      <nav className='navbar'>
        <div className='logo-container'>
          <NavLink to='/' className={({ isActive }) => (isActive ? '' : '')}>
            <img src={logo} alt='logo of book nook' />
            <h1 className='title-font logo-title'>Book Nook</h1>
          </NavLink>
        </div>

        {!modalOpen && (
          <div className='links-container'>
            <ul className='menu'>
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
                  <button
                    className='btn-util btn-logout'
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              )}
            </ul>
          </div>
        )}
        <img
          onClick={handleToggleModal}
          src={hamburgerIcon}
          alt='hamburger-menu-icon'
          className='hamburger-icon'
        />
        {modalOpen && (
          <Dialog
            modalRef={modalRef}
            handleCloseModalClick={handleCloseModalClick}
            handleLogout={handleLogout}
            isLoggedIn={isLoggedIn}
          />
        )}
      </nav>
    </>
  );
}
