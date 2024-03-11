/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {useUserContext} from '../hooks/contextHooks';
import {Link} from 'react-router-dom';
import FriendElement from '../components/FriendElement';
import ProfileFeed from '../components/ProfileFeed';

const Profile: React.FC = () => {
  const {user} = useUserContext();

  return (
    <div>
      <h2 className="text-center text-2xl font-bold">Profile page</h2>
      {user && (
        <div>
          <div className="my-10 flex h-full w-full flex-row items-center justify-center gap-5">
            <FriendElement friend={user} />
            <p>
              Productive since:{' '}
              {new Date(user?.created_at).toLocaleString('fi-FI', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              })}
            </p>
            <Link to="/logOut">
              <button className="m-auto flex items-center justify-center gap-2 text-red-400 hover:text-red-200">
                <label className="hidden sm:block">Logout</label>
                <i className="fa-solid fa-right-from-bracket"></i>
              </button>
            </Link>
          </div>
        </div>
      )}
      <ProfileFeed />
    </div>
  );
};

export default Profile;
