import '../components/BookList.css';
import BookList from '../components/BookList';

export default function BookListScreen({ findCurrentItems }) {
  return (
    <div className='booklist'>
      <div className='container'>
        <h2 className='title'>Book List</h2>

        <BookList findCurrentItems={findCurrentItems} />
      </div>
    </div>
  );
}
