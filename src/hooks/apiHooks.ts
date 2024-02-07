import {MediaItemWithOwner} from '../types/DBTypes';
import {fetchData} from '../lib/functions';
import {useEffect, useState} from 'react';
import {Credentials} from '../types/Localtypes';
import {LoginResponse} from '../types/MessageTypes';
const useMedia = (): MediaItemWithOwner[] => {
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

  return mediaArray;
};

const useUser = () => {
  // TODO: implement network connections for auth/user server
};

const useAuthentication = () => {
  const postLogin = async (creds: Credentials) => {
    try {
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
    } catch (error) {
      console.error('postLogin failed', error);
    }
  };
  return {postLogin};
};

export {useMedia, useUser, useAuthentication};
