import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

function AuthProvider(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    localStorage.getItem('isLoggedIn')
      ? localStorage.getItem('isLoggedIn')
      : false
  );

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(`/api/v1/users/check-login`);
        const data = await res.json();
        if (data.status === 'success') {
          localStorage.setItem('isLoggedIn', true);
          setIsLoggedIn(true);
        } else {
          localStorage.setItem('isLoggedIn', false);
          setIsLoggedIn(false);
        }
      } catch (err) {
        return setIsLoggedIn(false);
      }
    };
    if (isLoggedIn === true) {
      checkLogin();
    }
  }, [isLoggedIn]);

  const values = {
    isLoggedIn,
    setIsLoggedIn,
  };

  return (
    <AuthContext.Provider value={values}>{props.children}</AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
