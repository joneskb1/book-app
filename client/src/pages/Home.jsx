import "./Home.css";
import { Link } from "react-router-dom";
export default function Home() {
  return (
    <>
      <div className="home">
        <div className="cta-container">
          <h1 className="hero-text-heading">
            Your personal bookshelf,
            <br />
            anytime, anywhere.
          </h1>
          <Link className="cta-btn" to="/signup">
            Sign up
          </Link>
        </div>
      </div>
      <div className="features">
        <div className="text-container">
          <h2 className="heading">Features</h2>
          <ul>
            <li className="list-item">
              Easily keep track of the books you have read and the books you
              can't wait to read
            </li>
            <li className="list-item">
              Take your reading to the next level with Book Nook
            </li>
            <Link className="cta-btn" to="/signup">
              Sign up
            </Link>
          </ul>
        </div>
      </div>
    </>
  );
}
