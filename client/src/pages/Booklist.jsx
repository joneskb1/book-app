import "./Booklist.css";
import greenCheck from "../assets/green-check.svg";
import grayCheck from "../assets/gray-check.svg";
import { Link } from "react-router-dom";

export default function Booklist() {
  return (
    <>
      <div className="booklist">
        <div className="container">
          <h2 className="title">Book List</h2>
          <div className="filter-sort-container">
            <p className="filter-label">Filter:</p>
            <button className="read-btn">Read</button>
            <button className="unread-btn">Unread</button>
            <p className="sort-label">Sort:</p>
            <button className="title-btn">Title</button>
            <button className="author-btn">Author</button>
          </div>
          {/* map data here */}
          <div className="book">
            <p>1984, George Orwell</p>
            <img src={greenCheck} alt="green check" />
          </div>
          <Link className="btn" to="/addbook">
            Add Book
          </Link>
        </div>
      </div>
    </>
  );
}
