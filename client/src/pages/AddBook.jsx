import './AddBook.css';
import closeX from '../assets/close-x.svg';

export default function AddBook() {
  return (
    <>
      <div className='add-book'>
        <div className='container'>
          <div className='header'>Add Book</div>
          <img src={closeX} alt='close x' className='close-x' />
        </div>
      </div>
    </>
  );
}
