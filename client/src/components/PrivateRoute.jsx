import { useNavigate } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(`/api/v1/users/check-login`);
        const data = await res.json();
        if (data.status === 'success') {
          setIsLoggedIn(true);
          localStorage.setItem('isLoggedIn', true);
        } else {
          setIsLoggedIn(false);
          localStorage.setItem('isLoggedIn', false);
          return navigate('/login');
        }
      } catch (err) {
        console.log(err);
        setIsLoggedIn(false);
        localStorage.setItem('isLoggedIn', false);
        return navigate('/login');
      }
    };

    checkLogin();
  }, [isLoggedIn]);

  if (isLoggedIn == true) return children;
};
export default PrivateRoute;
