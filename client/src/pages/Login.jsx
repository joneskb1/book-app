import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import closeX from '../assets/close-x.svg';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// setup forgot password

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toggleLoggedIn, isLoggedIn } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

    try {
      const url = `/api/v1/users/login`;
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
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
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
          {error && <p className='error'>{error}</p>}
          <Link className='forgot-password'>Forgot Password?</Link>
          <button className='btn'>Login</button>
        </form>
      </div>
    </>
  );
}
