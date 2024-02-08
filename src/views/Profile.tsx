/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {UserResponse} from '../types/MessageTypes';
import {useUser} from '../hooks/apiHooks';

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserResponse['user'] | null>(null);
  const {getUserByToken} = useUser();

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem('token');
      const userResponse = await getUserByToken(token!);
      if (userResponse) {
        setUser(userResponse);
      }
    };

    getUser();
  }, []);

  return (
    <div>
      <h2>Profile page</h2>
      {user && (
        <>
          <h3>Username: {user?.username}</h3>
          <p>Email: {user?.email}</p>
          <p>Created: {new Date(user?.created_at).toLocaleString('fi-FI')}</p>
        </>
      )}
    </div>
  );
};

export default Profile;
