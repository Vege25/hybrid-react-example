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
  const [recomendedFriends, setRecomendedFriends] = React.useState<
    UserWithNoPassword[] | null
  >(null);

  useEffect(() => {
    searchUsers(user);
  }, []);

  useEffect(() => {
    // Get first 3 users from userArray to recommend friends
    const first3 = userArray?.slice(0, 3);
    setRecomendedFriends(first3);
  }, [userArray]);

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
          className="w-full rounded-md border-2 border-slate-400 p-2 transition-all duration-300 ease-in-out focus:border-slate-500 focus:outline-none"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="my-4 flex h-80 flex-col gap-2 overflow-y-scroll">
        {searchResults.length > 0 && search.length > 0 && (
          <div>
            <h3 className="mb-2 text-center text-xl font-bold">
              Search results
            </h3>
            {searchResults.map((user: UserWithNoPassword) => (
              <div
                className="m-auto my-1 flex w-full max-w-xl items-center justify-between gap-2 px-2"
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
                  className="rounded-full bg-slate-500 px-2 py-1"
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
            ))}
          </div>
        )}

        {searchResults.length === 0 && search.length > 0 && (
          <div className="flex h-full items-center justify-center">
            <p>No users found</p>
          </div>
        )}

        <div>
          {search.length === 0 && recomendedFriends && (
            <div>
              <h3 className="mb-2 text-center text-xl font-bold">
                Recomended friends
              </h3>
              {recomendedFriends.map((user: UserWithNoPassword) => (
                <div
                  className="m-auto my-1 flex w-full max-w-xl items-center justify-between gap-2 px-2"
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
                    className="rounded-full bg-slate-500 px-2 py-1"
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFriends;
