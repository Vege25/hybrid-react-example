import React from 'react';
import {NavigateFunction, useLocation, useNavigate} from 'react-router-dom';
import {MediaItemWithOwner} from '../types/DBTypes';
import Likes from '../components/Likes';
import Comments from '../components/Comments';

const Single: React.FC = () => {
  const {state} = useLocation();
  const navigate: NavigateFunction = useNavigate();
  const item: MediaItemWithOwner = state;

  return (
    <div className="flex flex-col items-center justify-center">
      {item.media_type.includes('video') ? (
        <video controls src={item.filename}></video>
      ) : (
        <img src={item.filename} alt={item.title} />
      )}
      <div className="flex w-full justify-center gap-4">
        <button
          onClick={() => {
            // setSelectedItem(undefined);
            navigate(-1);
          }}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div>
          <h3 className="text-xl font-bold capitalize">{item.title}</h3>
          <p className="text-md capitalize">{item.description}</p>
        </div>
        <Likes item={item} />
      </div>
      <Comments item={item} />
    </div>
  );
};

export default Single;
