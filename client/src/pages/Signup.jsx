import './Signup.css';
import { Link, useNavigate } from 'react-router-dom';
import closeX from '../assets/close-x.svg';
import { useState } from 'react';
import { set } from 'mongoose';

// setup form submit and forgot password

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate('/');
    }
  };

  async function handleFormSubmit(e) {
    e.preventDefault();

    // const url = `http://127.0.0.1:3002/api/v1/users/signup`;
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
    console.log(data);
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
          <button className='btn'>Sign up</button>
        </form>
      </div>
    </>
  );
}
