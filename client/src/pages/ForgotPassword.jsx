import { useState } from 'react';
import './ForgotPassword.css';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  async function handleFormSubmit(e) {
    e.preventDefault();

    try {
      const url = '/api/v1/users/forgot-password';
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setSuccessMsg('Reset link sent to email');
        setError(null);
        setEmail('');

        const id = setTimeout(() => {
          setSuccessMsg(null);
          clearTimeout(id);
        }, 2000);
      } else {
        setError(data.message);
        setSuccessMsg(null);
      }
    } catch (err) {
      setError(err.message);
      setSuccessMsg(null);
    }
  }
  return (
    <div className='forgot-password-form'>
      <form className='form' onSubmit={handleFormSubmit}>
        <h2 className='title'>Reset Password</h2>
        {successMsg && <p className='success-msg'>{successMsg}</p>}
        <label className='label' htmlFor='password'>
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
        {error && <p className='error'>{error}</p>}

        <button className='btn btn-util'>Reset Password</button>
      </form>
    </div>
  );
}
