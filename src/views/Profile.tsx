/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {useUserContext} from '../hooks/contextHooks';

const Profile: React.FC = () => {
  const {user} = useUserContext();

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
