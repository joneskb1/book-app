import './BookDetails.css';
import greenCheck from '../assets/green-check.svg';
import unreadX from '../assets/unread-x.svg';
import closeX from '../assets/close-x.svg';
import noImage from '../assets/no-image.svg';
import { Link, useNavigate } from 'react-router-dom';

export default function BookDetails() {
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate('/booklist');
    }
  };

  return (
    <>
      <div className='book-details'>
        <div className='container'>
          <Link to='/booklist'>
            <img
              src={closeX}
              tabIndex='0'
              alt='close x'
              className='close-x'
              onKeyDown={handleKeyDown}
            />
          </Link>
          <h2 className='details-header'>Book Details</h2>
          <div className='book-info'>
            <h3 className='details-title'>Title: TITLE HERE</h3>
            <p className='book-detail-p'>
              Google Book's Rating 4.5 (123 reviews)
            </p>
            <p className='book-detail-p'>Author: AUTHOR</p>
            <p className='book-detail-p summary'>
              Summary: Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Dicta excepturi odio harum aperiam, similique fuga? Consequuntur
              cumque culpa aut architecto exercitationem assumenda qui
              praesentium porro? In corrupti voluptas consectetur aliquid.
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dicta
              excepturi odio harum aperiam, similique fuga? Consequuntur cumque
            </p>
            <p className='book-detail-p'>ISBN: 123456789</p>
            <p className='book-detail-p'>Category: fiction</p>
            <p className='book-detail-p'>Number of Pages: 456</p>
            <p className='book-detail-p'>Publisher: Harmony</p>
            <p className='book-detail-p'>Date of Publication: 1987</p>
            <p className='book-detail-p'>
              Read Status: <img src={greenCheck} alt='read status' />
            </p>
            <img className='book-image' src={noImage} alt='cover of book' />
            <button className='btn'>Remove Book</button>
          </div>
        </div>
      </div>
    </>
  );
}
