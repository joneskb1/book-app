// import './BookList.css';
// import { Link } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import Paginate from '../components/Paginate';
// import BookDetailsPreview from '../components/BookDetailsPreview.jsx';
// import useSWR from 'swr';
// import useBooklist from '../hooks/useBooklist';

// export default function BookList({ findCurrentItems }) {
//   // const [bookList, setBookList] = useState();
//   const [error, setError] = useState(null);
//   const [filterBy, setFilterBy] = useState(() =>
//     localStorage.getItem('filter') ? localStorage.getItem('filter') : null
//   );

//   const [sortBy, setSortBy] = useState(() =>
//     localStorage.getItem('sort') ? localStorage.getItem('sort') : null
//   );

//   const [currentPage, setCurrentPage] = useState(() =>
//     localStorage.getItem('bookListCurrentPage')
//       ? Number.parseInt(localStorage.getItem('bookListCurrentPage'))
//       : 1
//   );

//   const [booksPerPage] = useState(5);
//   const [currentBooks, setCurrentBooks] = useState(null);
//   const { data: books, isLoading, isError } = useBooklist(filterBy, sortBy);
//   const [bookList, setBookList] = useState(books);
//   console.log(bookList);

//   useEffect(() => {
//     localStorage.setItem('bookListCurrentPage', currentPage);
//   }, [currentPage]);

//   useEffect(() => {
//     console.log('in useEffect');
//     if (bookList?.length > 0) {
//       console.log('we have books', bookList);
//       const currentItems = findCurrentItems(
//         currentPage,
//         booksPerPage,
//         bookList
//       );
//       console.log('current', currentItems);

//       setCurrentBooks(currentItems);

//       if (filterBy || sortBy) {
//         if (currentPage > Math.ceil(list.length / booksPerPage)) {
//           return setCurrentPage(1);
//         }
//         // is this redundant???
//         // setCurrentPage(currentPage);
//       }
//     }
//   }, [bookList, currentPage, booksPerPage, filterBy, sortBy]);

//   const handleSortFilterClick = (filterSortName, filterSortValue) => {
//     if (filterSortName === 'filter') {
//       filterBy === filterSortValue
//         ? setFilterBy(null)
//         : setFilterBy(filterSortValue);
//     }

//     if (filterSortName === 'sort') {
//       sortBy === filterSortValue ? setSortBy(null) : setSortBy(filterSortValue);
//     }

//     localStorage.getItem(filterSortName) === filterSortValue
//       ? localStorage.removeItem(filterSortName)
//       : localStorage.setItem(filterSortName, filterSortValue);
//   };

//   const filterSortContainer = (
//     <div className='filter-sort-container'>
//       <p className='filter-label'>Filter:</p>
//       <button
//         className={`read-btn ${filterBy === 'read' ? 'active' : ''}`}
//         // onClick={() => handleSortFilterClick('filter', 'read')}
//         onClick={() => {
//           filterBy === 'read' ? setFilterBy(null) : setFilterBy('read');

//           localStorage.getItem('filter') === 'read'
//             ? localStorage.removeItem('filter')
//             : localStorage.setItem('filter', 'read');
//         }}
//       >
//         Read
//       </button>
//       <button
//         className={`unread-btn ${filterBy === 'unread' ? 'active' : ''}`}
//         onClick={() => {
//           filterBy === 'unread' ? setFilterBy(null) : setFilterBy('unread');

//           localStorage.getItem('filter') === 'unread'
//             ? localStorage.removeItem('filter')
//             : localStorage.setItem('filter', 'unread');
//         }}
//       >
//         Unread
//       </button>
//       <p className='sort-label'>Sort:</p>
//       <button
//         className={`title-btn ${sortBy === 'title' ? 'active' : ''}`}
//         onClick={() => {
//           sortBy === 'title' ? setSortBy(null) : setSortBy('title');

//           localStorage.getItem('sort') === 'title'
//             ? localStorage.removeItem('sort')
//             : localStorage.setItem('sort', 'title');
//         }}
//       >
//         Title
//       </button>
//       <button
//         className={`author-btn ${sortBy === 'author' ? 'active' : ''}`}
//         onClick={() => {
//           sortBy === 'author' ? setSortBy(null) : setSortBy('author');

//           localStorage.getItem('sort') === 'author'
//             ? localStorage.removeItem('sort')
//             : localStorage.setItem('sort', 'author');
//         }}
//       >
//         Author
//       </button>
//     </div>
//   );

//   return (
//     <>
//       <div className='booklist'>
//         <div className='container'>
//           <h2 className='title'>Book List</h2>
//           {currentBooks && <p>list</p>}
//         </div>
//       </div>
//     </>
//   );

//   // const [loading, setLoading] = useState(false);
//   // const fetcher = (...args) => fetch(...args).then((res) => res.json());

//   // let url = `/api/v1/users/books`;

//   // if (filterBy != null || sortBy != null) {
//   //   url += `?filterBy=${filterBy}&sort=${sortBy}`;
//   // }

//   // const { data, error: swrError, isLoading } = useSWR(url, fetcher);

//   // if (swrError) {
//   //   console.log(swrError);
//   // }
//   // if (isLoading) {
//   //   console.log(isLoading);
//   // }

//   // let list;

//   // if (data?.data?.books) {
//   //   list = data.data.books;
//   //   console.log('BOOKLIST', list);
//   //   // const currentItems = findCurrentItems(currentPage, booksPerPage, list);

//   //   // setCurrentBooks(currentItems);

//   //   // if (filterBy || sortBy) {
//   //   //   if (currentPage > Math.ceil(list.length / booksPerPage)) {
//   //   //     return setCurrentPage(1);
//   //   //   }
//   //   // is this redundant???
//   //   // setCurrentPage(currentPage);
//   //   // }
//   // }

//   // const fetchedBookList = () => {
//   //   if (data?.data?.books) {
//   //     const list = data.data.books;
//   //     if (list.length < 1 && filterBy === null && sortBy === null) {
//   //       setBookList(null);
//   //     } else {
//   //       setBookList(list);
//   //     }

//   //     // setBookList(list);
//   //   }

//   //   console.log('SWR DATA: ', data?.data?.books);
//   // };

//   // useEffect(() => {
//   //   fetchedBookList();
//   // }, [filterBy, sortBy]);

//   // let ignore;
//   // useEffect(() => {
//   //   const abortController = new AbortController();
//   //   const { signal } = abortController;

//   //   ignore = false;
//   //   const fetchBooks = async () => {
//   //     try {
//   //       let url = `/api/v1/users/books`;

//   //       if (filterBy != null || sortBy != null) {
//   //         url += `?filterBy=${filterBy}&sort=${sortBy}`;
//   //       }

//   //       setLoading(true);

//   //       if (!ignore) {
//   //         const res = await fetch(url, { signal });
//   //         const data = await res.json();

//   //         if (data.status === 'success') {
//   //           console.log('booklist fetch', data.data.books);
//   //           if (
//   //             data.data.books.length < 1 &&
//   //             filterBy === null &&
//   //             sortBy === null
//   //           ) {
//   //             setBookList(null);
//   //           } else {
//   //             setBookList(data.data.books);
//   //           }
//   //           setError(null);
//   //           setLoading(false);
//   //         } else {
//   //           setError(data.message);
//   //           setLoading(false);
//   //         }
//   //       }
//   //     } catch (err) {
//   //       setError(err.message);
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchBooks();

//   //   return () => {
//   //     ignore = true;

//   //     return abortController.abort();
//   //   };
//   // }, [filterBy, sortBy]);

//   // useEffect(() => {
//   //   if (isLoading) return;

//   //   if (list) {
//   //     const currentItems = findCurrentItems(currentPage, booksPerPage, list);

//   //     setCurrentBooks(currentItems);

//   //     if (filterBy || sortBy) {
//   //       if (currentPage > Math.ceil(list.length / booksPerPage)) {
//   //         return setCurrentPage(1);
//   //       }
//   //       // is this redundant???
//   //       // setCurrentPage(currentPage);
//   //     }
//   //   }
//   // }, [list, currentPage, filterBy, sortBy, booksPerPage, isLoading]);

//   // useEffect(() => {
//   //   if (list) {
//   //     const currentItems = findCurrentItems(currentPage, booksPerPage, list);

//   //     setCurrentBooks(currentItems);

//   //     if (filterBy || sortBy) {
//   //       if (currentPage > Math.ceil(list.length / booksPerPage)) {
//   //         return setCurrentPage(1);
//   //       }
//   //       // is this redundant???
//   //       // setCurrentPage(currentPage);
//   //     }
//   //   }
//   // }, [list, currentPage, filterBy, sortBy, booksPerPage]);

//   // return (
//   //   <>
//   //     <div className='booklist'>
//   //       <div className='container'>
//   //         <h2 className='title'>Book List</h2>

//   //         {isLoading === true || list === 'undefined' ? (
//   //           'Loading...'
//   //         ) : list?.length > 0 && !isLoading ? (
//   //           <div>
//   //             {error && <p>{error}</p>}
//   //             {filterSortContainer}
//   //             <div className='detail-container'>
//   //               <p className='details'>Click book for details</p>
//   //               <p className='read-status'>Read Status</p>
//   //             </div>
//   //             {currentBooks &&
//   //               currentBooks.map((book, index) => {
//   //                 return (
//   //                   <BookDetailsPreview
//   //                     url='booklist'
//   //                     hasRead={book.hasRead}
//   //                     book={book._id}
//   //                     key={index}
//   //                   />
//   //                 );
//   //               })}
//   //             {currentBooks && (
//   //               <Paginate
//   //                 itemsPerPage={booksPerPage}
//   //                 items={list}
//   //                 currentPage={currentPage}
//   //                 setCurrentPage={setCurrentPage}
//   //               />
//   //             )}
//   //           </div>
//   //         ) : bookList === null ? (
//   //           <div>
//   //             <p>
//   //               There are currently no books in your list. Click the button
//   //               below to go to the add book page:
//   //             </p>
//   //             <Link className='link' to='/addbook'>
//   //               <button className='btn-util btn'>Add Book Page</button>
//   //             </Link>
//   //           </div>
//   //         ) : list?.length === 0 ? (
//   //           <div>
//   //             {filterSortContainer}
//   //             <p>
//   //               You don't have any books that meet those sorting or filtering
//   //               criteria
//   //             </p>
//   //           </div>
//   //         ) : (
//   //           'Loading...'
//   //         )}
//   //       </div>
//   //     </div>
//   //   </>
//   // );
//   // return (
//   //   <>
//   //     <div className='booklist'>
//   //       <div className='container'>
//   //         <h2 className='title'>Book List</h2>

//   //         {loading === true ? (
//   //           'Loading...'
//   //         ) : bookList?.length > 0 && !loading ? (
//   //           <div>
//   //             {error && <p>{error}</p>}
//   //             {filterSortContainer}
//   //             <div className='detail-container'>
//   //               <p className='details'>Click book for details</p>
//   //               <p className='read-status'>Read Status</p>
//   //             </div>
//   //             {currentBooks &&
//   //               currentBooks.map((book, index) => {
//   //                 return (
//   //                   <BookDetailsPreview
//   //                     url='booklist'
//   //                     hasRead={book.hasRead}
//   //                     book={book._id}
//   //                     key={index}
//   //                   />
//   //                 );
//   //               })}
//   //             {currentBooks && (
//   //               <Paginate
//   //                 itemsPerPage={booksPerPage}
//   //                 items={bookList}
//   //                 currentPage={currentPage}
//   //                 setCurrentPage={setCurrentPage}
//   //               />
//   //             )}
//   //           </div>
//   //         ) : bookList === null ? (
//   //           <div>
//   //             <p>
//   //               There are currently no books in your list. Click the button
//   //               below to go to the add book page:
//   //             </p>
//   //             <Link className='link' to='/addbook'>
//   //               <button className='btn-util btn'>Add Book Page</button>
//   //             </Link>
//   //           </div>
//   //         ) : bookList?.length === 0 ? (
//   //           <div>
//   //             {filterSortContainer}
//   //             <p>
//   //               You don't have any books that meet those sorting or filtering
//   //               criteria
//   //             </p>
//   //           </div>
//   //         ) : (
//   //           'Loading...'
//   //         )}
//   //       </div>
//   //     </div>
//   //   </>
//   // );
// }
