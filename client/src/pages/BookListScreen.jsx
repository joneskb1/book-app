import './BookList.css';
import BookListOutput from '../components/BookListOutput';

export default function BookList({ findCurrentItems }) {
  return (
    <div className='booklist'>
      <div className='container'>
        <h2 className='title'>Book List</h2>
        <BookListOutput findCurrentItems={findCurrentItems} />
      </div>
    </div>
  );
}
