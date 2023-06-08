// import './BookDetails.css';

// import closeX from '../assets/close-x.svg';
// import noImage from '../assets/no-image.svg';
// import ReadStatus from '../components/ReadStatus.jsx';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useState, useEffect } from 'react';

// export default function BookDetails() {
//   const navigate = useNavigate();
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const location = useLocation();
//   let { book, url } = location.state;
//   // const [inUsersList, setInUsersList] = useState(
//   //   () => book.inUsersBooks || url === 'booklist'
//   // );
//   const [hasRead, setHasRead] = useState(null);
//   const [inUsersList, setInUsersList] = useState(null);

//   // fetch hasRead and inUsersList on mount
//   useEffect(() => {
//     const checkBookStatus = async () => {
//       setLoading(true);
//       const res = await fetch(`/api/v1/users/books`);
//       const data = await res.json();
//       const books = data.data.books;
//       const usersBook = books.find((usersBook) => {
//         // use googleBooksId if coming from search page
//         if (book._id === undefined) {
//           return usersBook._id.googleBooksId === book.googleBooksId;
//         }
//         // use _id if coming from users book list
//         return usersBook._id._id === book._id;
//       });
//       setInUsersList(usersBook || false);
//       setHasRead(usersBook?.hasRead || false);
//       setLoading(false);
//     };

//     checkBookStatus();
//   }, []);

//   // useEffect(() => {
//   //   const getReadStatus = async () => {
//   //     const res = await fetch(`/api/v1/users/books`);
//   //     const data = await res.json();
//   //     const books = data.data.books;
//   //     const userBook = books.filter(
//   //       (userBook) => userBook._id._id === book._id
//   //     );

//   //     setHasRead(userBook[0]?.hasRead || false);
//   //   };
//   //   getReadStatus();
//   // }, [hasRead, inUsersList]);

//   // should be able to access book.hasRead coming from add Book page. If not on user's book list it will be "N/A"
//   // if (!hasRead) {
//   //   hasRead = book.hasRead;
//   // }
//   //true or false, coming from Add Book component, using find book method in book controller
//   // let inUsersList = book.inUsersBooks;

//   // if (url === 'booklist') {
//   //   inUsersList = true;
//   // }

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       if (url === 'booklist') {
//         navigate('/booklist');
//       } else if (url === 'addbook') {
//         navigate('/addbook');
//       }
//     }
//   };

//   async function handleRemoveClick(e) {
//     setLoading(true);
//     const id = e.target.dataset.id;
//     const res = await fetch(`/api/v1/users/delete/${id}`, {
//       method: 'DELETE',
//     });
//     setInUsersList(false);
//     setLoading(false);
//   }

//   async function handleAddClick(e) {
//     try {
//       setLoading(true);
//       const id = e.target.dataset.id;
//       const res = await fetch(`/api/v1/books/${id}`, {
//         method: 'POST',
//       });

//       const data = await res.json();

//       if (data.status === 'success') {
//         setError(null);
//         setInUsersList(true);
//         setHasRead(false);
//       } else {
//         setError(data.message);
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <>
//       <div className='book-details'>
//         <div className='container'>
//           <Link to={url === 'booklist' ? '/booklist' : '/addbook'}>
//             <img
//               src={closeX}
//               tabIndex='0'
//               alt='close x'
//               className='close-x'
//               onKeyDown={handleKeyDown}
//             />
//           </Link>
//           <h2 className='details-header'>Book Details</h2>
//           {error && <p>{error}</p>}
//           <div className='book-info'>
//             {book && (
//               <>
//                 <h3 className='details-title'>Title: {book.title}</h3>
//                 <p className='book-detail-p'>
//                   Google Book's Rating {book.avgGoogleBooksRating} (
//                   {book.googleBooksRatingsCount} reviews)
//                 </p>
//                 <p className='book-detail-p'>
//                   Author:{' '}
//                   {typeof book.authors === 'string'
//                     ? book.authors
//                     : book.authors.join(', ')}
//                 </p>
//                 <p className='book-detail-p summary'>{book.description}</p>
//                 <p className='book-detail-p'>ISBN: {book.isbn}</p>
//                 <p className='book-detail-p'>
//                   Category:{' '}
//                   {typeof book.categories === 'string'
//                     ? book.categories
//                     : book.categories.join(', ')}
//                 </p>
//                 <p className='book-detail-p'>
//                   Number of Pages: {book.pageCount}
//                 </p>
//                 <p className='book-detail-p'>Publisher: {book.publisher}</p>
//                 <p className='book-detail-p'>
//                   Date of Publication: {book.publishedDate}
//                 </p>
//                 {/* {inUsersList && (book.hasRead !== 'N/A' || hasRead) && (
//                   <p className='book-detail-p'>
//                     Read Status:{' '}
//                     <ReadStatus
//                       googleBooksId={book.googleBooksId}
//                       inUsersList={inUsersList}
//                       id={book._id}
//                     />
//                   </p>
//                 )} */}
//                 {inUsersList && !loading && (
//                   <p className='book-detail-p'>
//                     Read Status:{' '}
//                     <ReadStatus
//                       googleBooksId={book.googleBooksId}
//                       inUsersList={inUsersList}
//                       hasRead={hasRead}
//                     />
//                   </p>
//                 )}
//                 <img
//                   className='book-image'
//                   src={
//                     book.imageLinks?.thumbnail === 'N/A'
//                       ? noImage
//                       : book.imageLinks?.thumbnail
//                   }
//                   alt='cover of book'
//                 />

//                 {loading ? (
//                   'Loading...'
//                 ) : inUsersList ? (
//                   <button
//                     className='btn btn-util'
//                     data-id={book.googleBooksId}
//                     onClick={handleRemoveClick}
//                   >
//                     Remove Book
//                   </button>
//                 ) : (
//                   <button
//                     className='btn btn-util'
//                     data-id={book.googleBooksId}
//                     onClick={handleAddClick}
//                   >
//                     Add Book
//                   </button>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
