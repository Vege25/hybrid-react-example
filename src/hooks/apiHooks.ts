import {MediaItem, MediaItemWithOwner} from '../types/DBTypes';
import {fetchData} from '../lib/functions';
import {useEffect, useState} from 'react';
import {
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

  const postMedia = async (
    file: UploadResponse,
    inputs: Record<string, string>,
    token: string,
  ) => {
    //TODO: complete this function
    const media: Omit<
      MediaItem,
      'media_id' | 'user_id',
      'thumbnail' | 'created_at'
    > = {
      title: inputs.title,
      description: inputs.description,
      filename: file.data.filename,
      filesize: file.data.filesize,
      media_type: file.data.media_type,
    };
    const query = ``;

    const options = {
      method: 'POST',
      body: JSON.stringify({query, variables: media}),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const resData = await fetchData<{
      data: {mediaItems: MediaResponse};
    }>(import.meta.env.VITE_GRAPHQL_SERVER, options);
    console.log(resData.data.mediaItems);
  };

  return mediaArray;
};

const useUser = () => {
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

      console.log('userdata', userData);

      const {user} = userData.data.userWithToken;
      console.log(user);

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

  return {getUserByToken, postUser};
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
  // TODO: complete the postFile function
  const postFile = async (file: File, token: string) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
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
      const options = {
        method: 'POST',
        body: JSON.stringify({query, formData}),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const resData = await fetchData<UploadResponse>(
        import.meta.env.VITE_GRAPHQL_SERVER,
        options,
      );
      console.log(resData);
      return resData;
    } catch (error) {
      console.error('postFile failed', error);
    }
  };
  return {postFile};
};

export {useMedia, useUser, useAuthentication, useFile};
