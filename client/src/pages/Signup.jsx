import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';
import closeX from '../assets/close-x.svg';
import { AuthContext } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState(null);
  const { setIsLoggedIn, isLoggedIn } = useContext(AuthContext);
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
      if (!name || !email || !password || !passwordConfirm) {
        throw new Error(
          'Must enter name, email, password, and password confirm'
        );
      }

      if (password.length < 8 || passwordConfirm.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      const url = `/api/v1/users/signup`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          passwordConfirm,
        }),
      });

      const data = await res.json();

      if (
        data?.message ===
        'User validation failed: passwordConfirm: Passwords are not the same!'
      ) {
        throw new Error('Passwords do not match. Please try again.');
      }

      if (data?.message?.startsWith('E11000')) {
        throw new Error(
          'Error, something went wrong. This user may already exist. Try logging in instead. '
        );
      }

      if (data.status === 'success') {
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', true);
        navigate('/booklist');

        setError(null);
      } else {
        throw new Error('Error something went wrong. Please try again.');
      }
    } catch (err) {
      setError(err.message);
      localStorage.setItem('isLoggedIn', false);
    }
  }

  return (
    <>
      <div className='signup'>
        <form className='form' onSubmit={handleFormSubmit}>
          <h2 className='title'>Sign up</h2>

          <Link to='/'>
            <img
              src={closeX}
              tabIndex='0'
              alt='x close btn'
              className='close-x'
              onKeyDown={handleKeyDown}
            />
          </Link>
          <label className='label' htmlFor='name'>
            Name
          </label>
          <input
            className='input'
            value={name}
            onChange={(e) => setName(e.target.value)}
            name='name'
            type='text'
            id='name'
          />
          <label className='label' htmlFor='email'>
            Email
          </label>
          <input
            className='input'
            name='email'
            type='email'
            id='email'
            value={email}
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
          <label className='label' htmlFor='password-confirm'>
            Password Confirm
          </label>
          <input
            className='input'
            name='password-confirm'
            type='password'
            id='password-confirm'
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
          {error && <p className='error'>{error}</p>}
          <button className='btn'>Sign up</button>
        </form>
      </div>
    </>
  );
}
