import { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './ResetPassword.css';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState(null);
  const { setIsLoggedIn } = useContext(AuthContext);
  const { token } = useParams();
  const navigate = useNavigate();

  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`/api/v1/users/resetpassword/${token}`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          password,
          passwordConfirm,
        }),
      });

      const data = await res.json();
      if (data.status === 'success') {
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', true);
        navigate('/booklist');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
    }
  }
  return (
    <>
      <div className='reset-password'>
        <form className='form' onSubmit={handleFormSubmit}>
          <h2 className='title'>Reset Password</h2>

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
          <button className='btn'>Reset Password</button>
        </form>
      </div>
    </>
  );
}
