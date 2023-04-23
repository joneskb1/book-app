import './Account.css';
import closeX from '../assets/close-x.svg';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Account() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate('/booklist');
    }
  };

  async function handleFormSubmit(e) {
    e.preventDefault();
    const res = await fetch('/api/v1/users/', {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
      }),
    });

    const data = await res.json();

    console.log(data);
    // handle errors
  }

  return (
    <>
      <div className='account'>
        <div className='container'>
          <h2 className='title'>Account Info</h2>
          <Link to='/booklist'>
            <img
              src={closeX}
              tabIndex='0'
              alt='x close btn'
              className='close-x'
              onKeyDown={handleKeyDown}
            />
          </Link>
          <form className='form-info' onSubmit={handleFormSubmit}>
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
            <button className='btn'>Update</button>
          </form>
          <form className='password-form'>
            <label className='label' htmlFor='password'>
              Current Password
            </label>
            <input
              className='input'
              name='password'
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className='label' htmlFor='new-password'>
              New Password
            </label>
            <input
              className='input'
              name='password'
              type='password'
              id='new-password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <label className='label' htmlFor='password-confirm'>
              New Password Confirm
            </label>
            <input
              className='input'
              name='password-confirm'
              type='password'
              id='password-confirm'
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
            <button className='btn'>Reset Password</button>
          </form>
        </div>
      </div>
    </>
  );
}
