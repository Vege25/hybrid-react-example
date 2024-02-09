// UserContext.tsx
import React, {createContext, useState} from 'react';
import {UserWithNoPassword} from '../types/DBTypes';
import {useAuthentication, useUser} from '../hooks/apiHooks';
import {useNavigate} from 'react-router-dom';
import {AuthContextType, Credentials} from '../types/LocalTypes';

const UserContext = createContext<AuthContextType | null>(null);

// TODO: tee kohtaa 9

const UserProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<UserWithNoPassword | null>(null);
  const {postLogin} = useAuthentication();
  const {getUserByToken} = useUser();
  const navigate = useNavigate();

  // login, logout and autologin functions are here instead of components
  const handleLogin = async (credentials: Credentials) => {
    try {
      const loginResult = await postLogin(credentials);
      if (loginResult) {
        localStorage.setItem('token', loginResult.token);
        setUser(loginResult.user);
        navigate('/profile');
      }
    } catch (e) {
      console.log((e as Error).message);
    }
  };

  const handleLogout = () => {
    try {
      // remove token from local storage
      localStorage.removeItem('token');
      // set user to null
      setUser(null);
      // navigate to home
      navigate('/');
    } catch (e) {
      console.log((e as Error).message);
    }
  };

  // handleAutoLogin is used when the app is loaded to check if there is a valid token in local storage
  const handleAutoLogin = async () => {
    try {
      // TODO: get token from local storage
      const token = localStorage.getItem('token');
      // TODO: if token exists, get user data from API
      if (token) {
        const userResponse = await getUserByToken(token);
        if (userResponse) {
          setUser(userResponse);
          navigate('/');
        }
      }
      // TODO: set user to state
      // TODO: navigate to home
    } catch (e) {
      console.log((e as Error).message);
    }
  };

  return (
    <UserContext.Provider
      value={{user, handleLogin, handleLogout, handleAutoLogin}}
    >
      {children}
    </UserContext.Provider>
  );
};
export {UserProvider, UserContext};
