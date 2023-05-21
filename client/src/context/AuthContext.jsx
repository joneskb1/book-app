import React, { createContext, useState } from 'react';

const AuthContext = createContext();

function AuthProvider(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    localStorage.getItem('isLoggedIn')
      ? localStorage.getItem('isLoggedIn') === 'true'
      : false
  );

  const values = {
    isLoggedIn,
    setIsLoggedIn,
  };

  return (
    <AuthContext.Provider value={values}>{props.children}</AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
