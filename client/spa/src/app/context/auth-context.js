import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const verifyToken = async (token) => {
    return true
    return token ? true : false;
  };
  useEffect(() => {
    const storedToken = Cookies.get('token');
    if (storedToken) {
      verifyToken(storedToken).then((isValid) => {
        if (isValid) {
          setToken(storedToken);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      });
    }
  }, []);

  const saveToken = (newToken) => {
    setToken(newToken);
    Cookies.set('token', newToken, { expires: 30 });
    setIsAuthenticated(true);
  };

  const removeToken = () => {
    setToken(null);
    Cookies.remove('token');
    setIsAuthenticated(false);
  };

  const value = {
    token,
    isAuthenticated,
    saveToken,
    removeToken,
    verifyToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
