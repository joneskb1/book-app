import "./Signup.css";
import { Link } from "react-router-dom";
import closeX from "../assets/close-x.svg";
import { useState } from "react";
import { set } from "mongoose";

// setup form submit and forgot password

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  function handleFormSubmit(e) {
    e.preventDefault();
  }

  return (
    <>
      <div className="signup">
        <form className="form" onSubmit={handleFormSubmit}>
          <Link to="/">
            <img src={closeX} alt="x close btn" className="close-x" />
          </Link>
          <label className="label" htmlFor="name">
            Name
          </label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="name"
            type="text"
            id="name"
          />
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            className="input"
            name="email"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            className="input"
            name="password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="label" htmlFor="password-confirm">
            Password Confirm
          </label>
          <input
            className="input"
            name="password-confirm"
            type="password"
            id="password-confirm"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
          <button className="btn">Sign up</button>
        </form>
      </div>
    </>
  );
}
