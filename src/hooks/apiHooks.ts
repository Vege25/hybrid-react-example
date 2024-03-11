import {
  Like,
  MediaItem,
  MediaItemWithOwner,
  UserWithNoPassword,
  Comment,
} from '../types/DBTypes';
import {fetchData} from '../lib/functions';
import {useEffect, useState} from 'react';
import {
  Friend,
  LoginResponse,
  MediaResponse,
  MessageResponse,
  UploadResponse,
  UserResponse,
} from '../types/MessageTypes';
import {Credentials} from '../types/LocalTypes.ts';

const useMedia = () => {
  const [mediaArray, setMediaArray] = useState<MediaItemWithOwner[]>([]);
  const [myMediaArray, setMyMediaArray] = useState<MediaItemWithOwner[]>([]);
  const getMedia = async () => {
    try {
      const query = `
      query MediaItems {
        mediaItems {
          filename
          media_id
          thumbnail
          title
          description
          created_at
          filesize
          media_type
          owner {
            username
            user_id
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
      setMediaArray(resData.data.mediaItems);
    } catch (error) {
      console.error('getMedia failed', error);
    }
  };
  const getMyMedia = async (token: string) => {
    try {
      const query = `
        query MyMedias {
          myMedias {
            created_at
            description
            filename
            filesize
            media_type
            media_id
            owner {
              username
            }
            thumbnail
            title
            user_id
          }
        }
      `;
      const options = {
        method: 'POST',
        body: JSON.stringify({query}),
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const resData = await fetchData<{
        data: {myMedias: MediaItemWithOwner[]};
      }>(import.meta.env.VITE_GRAPHQL_SERVER, options);
      setMyMediaArray(resData.data.myMedias);
    } catch (error) {
      console.error('getMyMedia failed', error);
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

  return {mediaArray, myMediaArray, getMyMedia, postMedia};
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

  const getUsernameAvailable = async (username: string) => {
    const query = `
    query GetUsernameAviable($username: String) {
      getUsernameAviable(username: $username) {
        available
      }
    }
      `;

    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({query, username}),
    };
    const resData = await fetchData<{
      data: {getUsernameAviable: {available: boolean}};
    }>(import.meta.env.VITE_GRAPHQL_SERVER, options);
    const result = resData.data.getUsernameAviable.available;
    return result;
  };

  const getEmailAvailable = async (email: string) => {
    const query = `
    query GetEmailAviable($email: String) {
      getEmailAviable(email: $email) {
        available
      }
    }
      `;

    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({query, email}),
    };
    const resData = await fetchData<{
      data: {getEmailAviable: {available: boolean}};
    }>(import.meta.env.VITE_GRAPHQL_SERVER, options);
    const result = resData.data.getEmailAviable.available;
    return result;
  };
  const getUserById = async (user_id: number) => {
    const query = `
    query User($userId: ID!) {
      user(user_id: $userId) {
        created_at
        email
        level_name
        user_id
        username
      }
    }
      `;

    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({query, user_id}),
    };
    const resData = await fetchData<{
      data: {user: UserWithNoPassword};
    }>(import.meta.env.VITE_GRAPHQL_SERVER, options);
    const result = resData.data.user;
    return result;
  };

  return {
    userArray,
    getUserByToken,
    postUser,
    searchUsers,
    getEmailAvailable,
    getUsernameAvailable,
    getUserById,
  };
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
const useLike = () => {
  const postLike = async (media_id: string, token: string) => {
    const mutation = `
    mutation PostLike($mediaId: ID!) {
      postLike(media_id: $mediaId) {
        message
      }
    }
    `;

    const variables = {
      mediaId: String(media_id),
    };
    const options: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({query: mutation, variables}),
    };

    const resData = await fetchData<{
      data: {postLike: MessageResponse};
    }>(import.meta.env.VITE_GRAPHQL_SERVER, options);

    console.log('res', resData);
    console.log(resData.data.postLike);
    return resData.data.postLike;
  };

  const deleteLike = async (media_id: number, token: string) => {
    const query = `
    mutation DeleteLike($mediaId: ID!) {
      deleteLike(media_id: $mediaId) {
        message
      }
    }
    `;

    const variables = {
      mediaId: String(media_id),
    };

    const options: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({query, variables}),
    };
    const resData = await fetchData<{
      data: {deleteLike: MessageResponse};
    }>(import.meta.env.VITE_GRAPHQL_SERVER, options);
    console.log('DELETE', resData);
    return resData.data.deleteLike.message;
  };

  const getCountByMediaId = async (media_id: number) => {
    // Send a GET request to /likes/:media_id to get the number of likes.
    const query = `
    query GetCountByMediaId($mediaId: ID!) {
      getCountByMediaId(media_id: $mediaId) {
        count
      }
    }
    `;
    const variables = {
      mediaId: String(media_id),
    };
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({query, variables}),
    };
    const resData = await fetchData<{
      data: {getCountByMediaId: {count: number}};
    }>(import.meta.env.VITE_GRAPHQL_SERVER, options);
    return resData.data.getCountByMediaId;
  };

  const getUserLike = async (media_id: number, token: string) => {
    // Send a GET request to /likes/bymedia/user/:media_id to get the user's like on the media.
    const query = `
    query GetUserLike($mediaId: ID!) {
      getUserLike(media_id: $mediaId) {
        created_at
        like_id
        media_id
        user_id
      }
    }
    `;

    const variables = {
      mediaId: String(media_id),
    };

    const options: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({query, variables}),
    };

    const resData = await fetchData<{
      data: {getUserLike: Like};
    }>(import.meta.env.VITE_GRAPHQL_SERVER, options);

    return resData.data.getUserLike;
  };

  return {postLike, deleteLike, getCountByMediaId, getUserLike};
};

const useComment = () => {
  const postComment = async (
    comment_text: string,
    media_id: number,
    token: string,
  ) => {
    const query = `
      mutation postComment($input: CommentInput!) {
        postComment(input: $input) {
          message
        }
      }
    `;
    const variables = {
      input: {
        comment_text,
        media_id,
      },
    };
    // options with authorazion
    const options: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({query, variables}),
    };

    const resData = await fetchData<MessageResponse>(
      import.meta.env.VITE_GRAPHQL_SERVER,
      options,
    );
    return resData;
  };

  const getCommentsByMediaId = async (media_id: number) => {
    const query = `
    query GetCommentsByMediaId($mediaId: ID!) {
      getCommentsByMediaId(media_id: $mediaId) {
        comment_id
        comment_text
        created_at
        user_id
        media_id
      }
    }`;
    const variables = {
      mediaId: media_id,
    };
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({query, variables}),
    };
    const resData = await fetchData<{
      data: {getCommentsByMediaId: Comment[]};
    }>(import.meta.env.VITE_GRAPHQL_SERVER, options);
    return resData.data.getCommentsByMediaId;
  };

  return {postComment, getCommentsByMediaId};
};

export {
  useMedia,
  useUser,
  useAuthentication,
  useFile,
  useFriends,
  useLike,
  useComment,
};
