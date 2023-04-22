import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import closeX from '../assets/close-x.svg';
import { useState } from 'react';

// setup form submit and forgot password

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate('/');
    }
  };

  function handleFormSubmit(e) {
    e.preventDefault();
  }

  return (
    <>
      <div className='login'>
        <form className='form' onSubmit={handleFormSubmit}>
          <Link to='/'>
            <img
              src={closeX}
              tabIndex='0'
              onKeyDown={handleKeyDown}
              alt='x close btn'
              className='close-x'
            />
          </Link>
          <label className='label' htmlFor='email'>
            Email
          </label>
          <input
            className='input'
            name='email'
            type='email'
            value={email}
            id='email'
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className='label' htmlFor='password'>
            Password
          </label>
          <input
            className='input'
            name='password'
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Link className='forgot-password'>Forgot Password?</Link>
          <button className='btn'>Login</button>
        </form>
      </div>
    </>
  );
}
