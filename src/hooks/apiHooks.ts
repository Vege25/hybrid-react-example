import {
  MediaItem,
  MediaItemWithOwner,
  UserWithNoPassword,
} from '../types/DBTypes';
import {fetchData} from '../lib/functions';
import {useEffect, useState} from 'react';
import {
  Friend,
  LoginResponse,
  MediaResponse,
  UploadResponse,
  UserResponse,
} from '../types/MessageTypes';
import {Credentials} from '../types/LocalTypes.ts';

const useMedia = () => {
  const [mediaArray, setMediaArray] = useState<MediaItemWithOwner[]>([]);
  const getMedia = async () => {
    try {
      const query = `
      query MediaItems {
        mediaItems {
          filename
          thumbnail
          title
          description
          created_at
          filesize
          media_type
          owner {
            username
          }
        }
      }
    `;
      const options = {
        method: 'POST',
        body: JSON.stringify({query}),
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const resData = await fetchData<{
        data: {mediaItems: MediaItemWithOwner[]};
      }>(import.meta.env.VITE_GRAPHQL_SERVER, options);
      console.log(resData.data.mediaItems);
      setMediaArray(resData.data.mediaItems);
    } catch (error) {
      console.error('getMedia failed', error);
    }
  };

  useEffect(() => {
    getMedia();
  }, []);

  const postMedia = (
    file: UploadResponse,
    inputs: Record<string, string>,
    token: string,
  ) => {
    const media: Omit<
      MediaItem,
      'media_id' | 'user_id' | 'thumbnail' | 'created_at'
    > = {
      title: inputs.title,
      description: inputs.description,
      filename: file.data.filename,
      filesize: file.data.filesize,
      media_type: file.data.media_type,
    };

    const query = `
      mutation CreateMediaItem($input: MediaItemInput!) {
        createMediaItem(input: $input) {
          created_at
          description
          filename
          filesize
          media_id
          media_type
          owner {
            created_at
            email
            level_name
            user_id
            username
          }
          title
          user_id
        }
      }
    `;

    // Pass the "input" variable in the "variables" field
    const options = {
      method: 'POST',
      body: JSON.stringify({
        query,
        variables: {input: media}, // Ensure the variable name is "input"
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    return fetchData<{
      data: {createMediaItem: MediaResponse};
    }>(import.meta.env.VITE_GRAPHQL_SERVER, options);
  };

  return {mediaArray, postMedia};
};

const useFriends = () => {
  const [friendsArray, setFriendsArray] = useState<Friend[]>([]);
  const getFriendsByToken = async (token: string) => {
    try {
      const query = `
      query Friends {
        friends {
          username
          user_id
        }
      }
      `;

      const options: RequestInit = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({query}),
      };

      const friendsData = await fetchData<{data?: {friends?: Friend[]}}>(
        import.meta.env.VITE_GRAPHQL_SERVER,
        options,
      );

      if (friendsData.data && friendsData.data.friends) {
        const friends = friendsData.data.friends;
        console.log('friends fetch', friends);
        setFriendsArray(friends);
      } else {
        console.error(
          'Invalid data received from GraphQL server:',
          friendsData,
        );
      }
    } catch (error) {
      console.error('getFriendsByToken failed', error);
    }
  };
  const postFriendRequest = async (token: string, friend_id: string) => {
    try {
      const query = `
      mutation Mutation($input: friendId!) {
        sendFriendRequest(input: $input) {
          message
          user {
            user_id
          }
        }
      }
      `;
      const variables = {
        input: {
          friend_id: friend_id,
        },
      };
      const options: RequestInit = {
        method: 'POST',
        body: JSON.stringify({query, variables}),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const resData = await fetchData<{
        data: {userWithToken: UserWithNoPassword};
      }>(import.meta.env.VITE_GRAPHQL_SERVER, options);
      const data = resData.data.userWithToken;
      return data;
    } catch (error) {
      console.error('postFriendRequest failed', error);
    }
  };
  return {friendsArray, getFriendsByToken, postFriendRequest};
};

const useUser = () => {
  const [userArray, setUserArray] = useState<UserWithNoPassword[]>([]);
  // TODO: implement network connections for auth/user server
  const getUserByToken = async (token: string) => {
    try {
      const query = `
        query getUserByToken {
          userWithToken {
            message
            user {
              created_at
              email
              level_name
              user_id
              username
            }
          }
        }
      `;

      const options: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({query}),
      };

      const userData = await fetchData<{
        data: {userWithToken: {user: UserResponse['user']}; message: string};
      }>(import.meta.env.VITE_GRAPHQL_SERVER, options);

      const {user} = userData.data.userWithToken;

      return user;
    } catch (error) {
      console.error('getUserByToken failed', error);
    }
  };

  const postUser = async (user: {
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      const query = `
        mutation CreateUser($input: UserInput!) {
          createUser(input: $input) {
            message
            user {
              created_at
              email
              level_name
              user_id
              username
            }
          }
        }
      `;
      const variables = {
        input: {
          username: user.username,
          password: user.password,
          email: user.email,
        },
      };
      const options: RequestInit = {
        method: 'POST',
        body: JSON.stringify({query, variables}),
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const resData = await fetchData<{
        data: {createUser: UserResponse};
      }>(import.meta.env.VITE_GRAPHQL_SERVER, options);
      const data = resData.data.createUser.user;
      console.log('response', data);
      return data;
    } catch (error) {
      console.error('postUser failed', error);
    }
  };
  const searchUsers = async (tokenUser: UserWithNoPassword | null) => {
    try {
      const query = `
      query Users {
        users {
          user_id
          username
          level_name
          email
          created_at
        }
      }
      `;

      const options: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({query}),
      };

      const users = await fetchData<{
        data: {users: UserWithNoPassword[]};
      }>(import.meta.env.VITE_GRAPHQL_SERVER, options);
      const usersWithoutMe = users.data.users.filter(
        (currentUser) => currentUser.username !== tokenUser?.username,
      );
      setUserArray(usersWithoutMe);
    } catch (error) {
      console.error('searchUsers failed', error);
    }
  };

  return {userArray, getUserByToken, postUser, searchUsers};
};

const useAuthentication = () => {
  const postLogin = async (creds: Credentials) => {
    const query = `
    mutation Login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        token
        message
        user {
          user_id
          username
          email
          level_name
          created_at
        }
      }
    }
  `;

    const variables = {
      username: creds.username,
      password: creds.password,
    };
    const options = {
      method: 'POST',
      body: JSON.stringify({query, variables}),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const resData = await fetchData<{
      data: {login: LoginResponse};
    }>(import.meta.env.VITE_GRAPHQL_SERVER, options);
    console.log(resData.data.login);
    return resData.data.login;
  };
  return {postLogin};
};
const useFile = () => {
  const postFile = async (file: File, token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      body: formData,
    };
    return await fetchData<UploadResponse>(
      import.meta.env.VITE_UPLOAD_SERVER + '/upload',
      options,
    );
  };

  return {postFile};
};

export {useMedia, useUser, useAuthentication, useFile, useFriends};
