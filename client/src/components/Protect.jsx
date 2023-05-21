import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Protect({ children }) {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(`/api/v1/users/check-login`);
        const data = await res.json();
        const date = new Date();
        console.log(date);
        if (data.status === 'success') {
          setIsLoggedIn(true);
          localStorage.setItem('isLoggedIn', true);
        } else {
          setIsLoggedIn(false);
          localStorage.setItem('isLoggedIn', false);
          navigate('/login');
        }
      } catch (err) {
        console.log(err);
        setIsLoggedIn(false);
        localStorage.setItem('isLoggedIn', false);
        navigate('/login');
      }
    };

    checkLogin();
  }, []);

  if (isLoggedIn) return children;
}
