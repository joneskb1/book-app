import './Navbar.css';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <>
      <nav className='navbar'>
        <div className='logo-container'>
          <img src={logo} alt='logo of book nook' />
          <h1 className='title-font logo-title'>Book Nook</h1>
        </div>
        <div className='links-container'>
          <ul>
            <li>
              <Link className='links' to='/login'>
                Login
              </Link>
            </li>
            <li>
              <Link className='links' to='/signup'>
                Sign up
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
