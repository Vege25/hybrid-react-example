import React from 'react';
import MediaRow from '../components/MediaRow';
import {useMedia} from '../hooks/apiHooks';

const Home: React.FC = () => {
  const {mediaArray} = useMedia();
  return (
    <>
      <h2 className="text-center text-2xl font-bold">My Feed</h2>
      <div>
        <div>
          {mediaArray.map((item) => (
            <MediaRow key={item.media_id} item={item} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
