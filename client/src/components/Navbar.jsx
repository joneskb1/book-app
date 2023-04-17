import "./Navbar.css";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <nav className="navbar">
        <div className="logo-container">
          <Link to="/">
            <img src={logo} alt="logo of book nook" />
            <h1 className="title-font logo-title">Book Nook</h1>
          </Link>
        </div>
        <div className="links-container">
          <ul>
            <li>
              <Link className="links" to="/login">
                Login
              </Link>
            </li>
            <li>
              <Link className="links" to="/signup">
                Sign up
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
