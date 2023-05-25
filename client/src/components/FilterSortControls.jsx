import { useState } from 'react';

export default function FilterSortControls({
  filterBy,
  setFilterBy,
  sortBy,
  setSortBy,
}) {
  const handleFilterSortClick = (filterSortName, filterSortValue) => {
    if (filterSortName === 'filter') {
      filterBy === filterSortValue
        ? setFilterBy(null)
        : setFilterBy(filterSortValue);
    }

    if (filterSortName === 'sort') {
      sortBy === filterSortValue ? setSortBy(null) : setSortBy(filterSortValue);
    }

    localStorage.getItem(filterSortName) === filterSortValue
      ? localStorage.removeItem(filterSortName)
      : localStorage.setItem(filterSortName, filterSortValue);
  };
  return (
    <>
      <div className='filter-sort-container'>
        <p className='filter-label'>Filter:</p>
        <button
          className={`read-btn ${filterBy === 'read' ? 'active' : ''}`}
          onClick={() => handleFilterSortClick('filter', 'read')}
        >
          Read
        </button>
        <button
          className={`unread-btn ${filterBy === 'unread' ? 'active' : ''}`}
          onClick={() => handleFilterSortClick('filter', 'unread')}
        >
          Unread
        </button>
        <p className='sort-label'>Sort:</p>
        <button
          className={`title-btn ${sortBy === 'title' ? 'active' : ''}`}
          onClick={() => handleFilterSortClick('sort', 'title')}
        >
          Title
        </button>
        <button
          className={`author-btn ${sortBy === 'author' ? 'active' : ''}`}
          onClick={() => handleFilterSortClick('sort', 'author')}
        >
          Author
        </button>
      </div>
    </>
  );
}
