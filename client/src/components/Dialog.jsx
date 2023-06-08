import React from 'react';
import './Dialog.css';
import { NavLink } from 'react-router-dom';

const Dialog = ({
  handleCloseModalClick,
  handleLogout,
  isLoggedIn,
  modalRef,
}) => {
  const handleCloseModalLogoutClick = () => {
    handleLogout();
    handleCloseModalClick();
  };
  return (
    <dialog
      ref={modalRef}
      className={`dialog ${!isLoggedIn ? 'logged-out' : ''}`}
      onClick={handleCloseModalClick}
    >
      <div
        className={`dialog-content ${!isLoggedIn ? 'logged-out' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <ul className='dialog-ul'>
          {!isLoggedIn ? (
            <>
              {' '}
              <li>
                <NavLink
                  className='dialog-link'
                  to={`${'/login'}`}
                  onClick={handleCloseModalClick}
                >
                  Login
                </NavLink>{' '}
              </li>
              <li>
                <NavLink
                  className='dialog-link'
                  to='/signup'
                  onClick={handleCloseModalClick}
                >
                  Sign up
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  className='dialog-link'
                  to='/booklist'
                  onClick={handleCloseModalClick}
                >
                  My Book List
                </NavLink>
              </li>

              <li>
                <NavLink
                  className='dialog-link'
                  to='/addbook'
                  onClick={handleCloseModalClick}
                >
                  Add Book
                </NavLink>
              </li>
              <li>
                <NavLink
                  className='dialog-link'
                  to='/account'
                  onClick={handleCloseModalClick}
                >
                  Account
                </NavLink>
              </li>
              <li
                className='btn-util dialog-logout'
                onClick={handleCloseModalLogoutClick}
              >
                Logout
              </li>
            </>
          )}
        </ul>
        <button
          className='btn-util close-modal-btn'
          onClick={handleCloseModalClick}
        >
          Close
        </button>
      </div>
    </dialog>
  );
};

export default Dialog;
