/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {useUserContext} from '../hooks/contextHooks';

const LogOut: React.FC = () => {
  // on mount log out
  const {handleLogout} = useUserContext();
  useEffect(() => {
    handleLogout();
  }, []);
  return (
    <>
      <p>Logout</p>
    </>
  );
};

export default LogOut;
