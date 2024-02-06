import React, {useEffect, useState} from 'react';
import MediaRow from '../components/MediaRow';
import {MediaItem} from '../types/DBTypes';
import {fetchData} from '../lib/functions';

const Home: React.FC = () => {
  const [mediaArray, setMediaArray] = useState<MediaItem[]>([]);
  const getMedia = async () => {
    try {
      const query = `
      query MediaItems {
        mediaItems {
          filename
          thumbnail
          title
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

      const resData = await fetchData<{data: {mediaItems: MediaItem[]}}>(
        import.meta.env.VITE_GRAPHQL_SERVER,
        options,
      );
      console.log(resData.data.mediaItems);
      setMediaArray(resData.data.mediaItems);
    } catch (error) {
      console.error('getMedia failed', error);
    }
  };
  useEffect(() => {
    getMedia();
  }, []);
  return (
    <>
      <h2>My Media</h2>
      <table>
        <thead>
          <tr>
            <th>Thumbnail</th>
            <th>Title</th>
            <th>Description</th>
            <th>Created</th>
            <th>Size</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {mediaArray.map((item) => (
            <MediaRow key={item.media_id} item={item} />
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Home;
