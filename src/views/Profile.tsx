/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {useUserContext} from '../hooks/contextHooks';
import {Link} from 'react-router-dom';
import FriendElement from '../components/FriendElement';

const Profile: React.FC = () => {
  const {user} = useUserContext();

  return (
    <div>
      <h2 className="text-center text-2xl font-bold">Profile page</h2>
      {user && (
        <div>
          <div className="flex flex-row gap-5 items-center justify-center w-full h-full my-10">
            <FriendElement friend={user} />
            <p>
              Productive life since:{' '}
              {new Date(user?.created_at).toLocaleString('fi-FI', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              })}
            </p>
          </div>
          <Link to="/logOut">
            <button className="block m-auto">LogOut</button>
          </Link>
        </div>
      )}
      <div className="text-center my-10">Feed coming soon...</div>
    </div>
  );
};

export default Profile;
