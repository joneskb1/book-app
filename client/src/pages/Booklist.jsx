import './BookList.css';
import greenCheck from '../assets/green-check.svg';
import unreadX from '../assets/unread-x.svg';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

export default function BookList() {
  const { isLoggedIn } = useContext(AuthContext);
  console.log('BOOKLIST LOG', isLoggedIn);

  return (
    <>
      <div className='booklist'>
        <div className='container'>
          <h2 className='title'>Book List</h2>
          <div className='filter-sort-container'>
            <p className='filter-label'>Filter:</p>
            <button className='read-btn'>Read</button>
            <button className='unread-btn'>Unread</button>
            <p className='sort-label'>Sort:</p>
            <button className=' title-btn'>Title</button>
            <button className=' author-btn'>Author</button>
          </div>
          <div className='detail-container'>
            <p className='details'>Click book for details</p>
            <p className='read-status'>Read Status</p>
          </div>
          {/* map data here */}
          <Link className='book-link' to='/bookdetails'>
            <div className='book'>
              <p>1984, George Orwell</p>
              <img src={greenCheck} alt='green check' />
            </div>
          </Link>
          <Link className='btn btn-util' to='/addbook'>
            Add Book
          </Link>
        </div>
      </div>
    </>
  );
}