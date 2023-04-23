import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import closeX from '../assets/close-x.svg';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// setup forgot password

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { toggleLoggedIn, isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/booklist');
    }
  }, [isLoggedIn]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate('/');
    }
  };

  async function handleFormSubmit(e) {
    e.preventDefault();
    const url = `/api/v1/users/login`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (data.status === 'success') {
        toggleLoggedIn();
        navigate('/booklist');
      } else {
        // show error
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className='login'>
        <form className='form' onSubmit={handleFormSubmit}>
          <h2 className='title'>Login</h2>
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
