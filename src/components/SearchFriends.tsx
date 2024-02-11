import React, {useEffect} from 'react';
import {useFriends, useUser} from '../hooks/apiHooks';
import {UserWithNoPassword} from '../types/DBTypes';
import UserProfileIcon from './UserProfileIcon';
import {useUserContext} from '../hooks/contextHooks';

const SearchFriends: React.FC = () => {
  const [search, setSearch] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<
    UserWithNoPassword[]
  >([]);
  const {user} = useUserContext();
  const {userArray, searchUsers} = useUser();
  const {postFriendRequest} = useFriends();
  const [friendId, setFriendId] = React.useState<string | null>(null);

  useEffect(() => {
    searchUsers(user);
  }, []);

  useEffect(() => {
    if (search.length > 0) {
      const fetchSearchResults = async () => {
        if (userArray && userArray.length > 0) {
          const friends = userArray.filter((friend) => {
            return friend.username.toLowerCase().includes(search.toLowerCase());
          });
          setSearchResults(friends);
        }
      };
      fetchSearchResults();
    } else {
      setSearchResults([]);
    }
  }, [search]);

  const handlePostFriendRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token && friendId) {
        await postFriendRequest(token, friendId);
        alert('Friend request sent');
      }
    } catch (e) {
      console.log((e as Error).message);
    }
  };

  return (
    <div className="my-6">
      <div className="m-auto w-full max-w-xl px-2">
        <input
          type="text"
          placeholder="Search for friends"
          value={search}
          className="w-full rounded-md border-2 border-slate-400 p-2 focus:outline-none focus:border-slate-500 transition-all duration-300 ease-in-out"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex flex-col my-4 gap-2 h-80 overflow-y-scroll">
        {searchResults.length > 0 ? (
          searchResults.map((user: UserWithNoPassword) => (
            <div
              className="flex my-1 justify-between gap-2 items-center m-auto w-full max-w-xl px-2"
              key={user.user_id}
            >
              <div className="flex items-center gap-2">
                <UserProfileIcon
                  userInitial={
                    user?.username ? Array.from(user?.username)[0] : 'G'
                  }
                />
                <p>{user.username}</p>
              </div>
              <button
                className="rounded-full px-2 py-1 bg-slate-500"
                key={`addFriend_${user.user_id}`}
                onClick={() => {
                  const id = user.user_id.toString();
                  setFriendId(id);
                  handlePostFriendRequest();
                }}
              >
                Add
              </button>
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center">
            <p>No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFriends;
