/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {useFriends} from '../hooks/apiHooks';
import {Friend} from '../types/MessageTypes';
import SearchFriends from '../components/SearchFriends';
import FriendElement from '../components/FriendElement';
const Friends: React.FC = () => {
  const {friendsArray, getFriendsByToken} = useFriends();
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        getFriendsByToken(token);
      }
    } catch (e) {
      console.log((e as Error).message);
    }
  }, []);
  return (
    <div>
      <h2 className="text-center text-2xl font-bold">Friends Page</h2>

      {/* Search Section */}
      <SearchFriends />

      {/* Pending Friends Section */}
      <div className="pending-friends-section">
        {/* Your pending friends components go here */}
      </div>

      {/* Friends List Section */}
      {}
      <div className="friends-list-section">
        <h2 className="text-lg font-bold ml-4">Your Friends</h2>
        <div className="ml-4 flex flex-col gap-4">
          {friendsArray.length > 0 ? (
            friendsArray.map((friend: Friend) => (
              <FriendElement friend={friend} key={friend.user_id} />
            ))
          ) : (
            <p>No friends yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Friends;
