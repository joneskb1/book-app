import './BookList.css';
import BookListOutputUpdate from '../components/BookListOutputUpdate';

export default function BookListScreen({ findCurrentItems }) {
  return (
    <div className='booklist'>
      <div className='container'>
        <h2 className='title'>Book List</h2>

        <BookListOutputUpdate findCurrentItems={findCurrentItems} />
      </div>
    </div>
  );
}
