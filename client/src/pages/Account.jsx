import './Account.css';
import { useState, useEffect } from 'react';

export default function Account() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  function flashMsg(msg) {
    setSuccessMsg(msg);
    const id = setTimeout(() => {
      setSuccessMsg(null);
      clearTimeout(id);
    }, 2000);
  }

  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch('/api/v1/users/');

        const data = await res.json();

        if (data.status === 'success') {
          setName(data.data.user.name);
          setEmail(data.data.user.email);
          setError(null);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err.message);
      }
    }

    getUser();
  }, []);

  async function handleUserInfoSubmit(e) {
    e.preventDefault();
    try {
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

      if (data.status === 'success') {
        flashMsg('Data Updated!');
        setError(null);
      } else {
        setError(data.message);
        setSuccessMsg(null);
      }
    } catch (err) {
      setError(err.message);
      setSuccessMsg(null);
    }
  }

  async function handlePasswordReset(e) {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/users/updatePassword', {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          newPasswordConfirm,
        }),
      });

      const data = await res.json();

      if (data.status === 'success') {
        //show success
        flashMsg('Data Updated!');
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
      <div className='account'>
        <div className='container'>
          <h2 className='title'>Account Info</h2>
          {error && <p className='error'>{error}</p>}
          {successMsg && <p className='success-msg'>{successMsg}</p>}
          <form className='form-info' onSubmit={handleUserInfoSubmit}>
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
            <button className='btn btn-util'>Update</button>
          </form>
          <form className='password-form' onSubmit={handlePasswordReset}>
            <label className='label' htmlFor='currentPassword'>
              Current Password
            </label>
            <input
              className='input'
              name='currentPassword'
              type='password'
              id='currentPassword'
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <label className='label' htmlFor='newPassword'>
              New Password
            </label>
            <input
              className='input'
              name='newPassword'
              type='password'
              id='newPassword'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <label className='label' htmlFor='newPasswordConfirm'>
              New Password Confirm
            </label>
            <input
              className='input'
              name='newPasswordConfirm'
              type='password'
              id='newPasswordConfirm'
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
            />
            <button className='btn btn-util'>Reset Password</button>
          </form>
        </div>
      </div>
    </>
  );
}
