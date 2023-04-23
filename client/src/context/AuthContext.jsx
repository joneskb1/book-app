import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

function AuthProvider(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(`/api/v1/users/check-login`);
        const data = await res.json();

        if (data.status === 'success') {
          return setIsLoggedIn(true);
        } else {
          return;
        }
      } catch (err) {
        // console.log(err);
      }
      return setIsLoggedIn(false);
    };

    checkLogin();
  }, []);

  const toggleLoggedIn = () => setIsLoggedIn((isLoggedIn) => !isLoggedIn);

  const values = {
    isLoggedIn,
    toggleLoggedIn,
  };

  return (
    <AuthContext.Provider value={values}>{props.children}</AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
