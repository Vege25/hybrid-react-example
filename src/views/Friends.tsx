/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {useFriends} from '../hooks/apiHooks';
import {Friend} from '../types/MessageTypes';
import SearchFriends from '../components/SearchFriends';
import FriendElement from '../components/FriendElement';
import {PendingFriend} from '../types/DBTypes';
const Friends: React.FC = () => {
  const {
    friendsArray,
    getFriendsByToken,
    pendingFriendsArray,
    getPendingFriends,
    acceptFriendRequest,
  } = useFriends();

  // Get friends by token on mount
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        getFriendsByToken(token);
        getPendingFriends(token);
        console.log(pendingFriendsArray);
      }
    } catch (e) {
      console.log((e as Error).message);
    }
  }, []);

  const handleFriendRequestAccept = async (user_id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await acceptFriendRequest(token, String(user_id));
        res?.message && alert(res.message);
        getPendingFriends(token);
      }
    } catch (e) {
      console.log((e as Error).message);
    }
  };

  return (
    <div>
      <h2 className="text-center text-2xl font-bold">Friends Page</h2>

      {/* Search Section */}
      <SearchFriends />

      {/* Pending Friends Section */}
      <div className="pending-friends-section">
        <div className="m-auto w-full max-w-xl px-2">
          <h2 className="ml-4 text-lg font-bold">Friend requests</h2>
          <div className="ml-4 flex flex-col gap-4">
            {pendingFriendsArray && pendingFriendsArray.length > 0 ? (
              pendingFriendsArray.map((user: PendingFriend) => (
                <div className="flex gap-2" key={user.user_id}>
                  <FriendElement friend={user} key={user.user_id} />
                  <button
                    className="rounded-full bg-slate-500 px-2 py-1"
                    onClick={() => {
                      handleFriendRequestAccept(user.user_id);
                    }}
                  >
                    Accept
                  </button>
                </div>
              ))
            ) : (
              <p>No friend requests</p>
            )}
          </div>
        </div>
      </div>

      {/* Friends List Section */}
      <div className="m-auto w-full max-w-xl px-2">
        <h2 className="ml-4 text-lg font-bold">Your Friends</h2>
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
