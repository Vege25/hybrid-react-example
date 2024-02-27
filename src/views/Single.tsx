import React from 'react';
import {NavigateFunction, useLocation, useNavigate} from 'react-router-dom';
import {MediaItemWithOwner} from '../types/DBTypes';
import Likes from '../components/Likes';
import Comments from '../components/Comments';

const Single: React.FC = () => {
  const {state} = useLocation();
  const navigate: NavigateFunction = useNavigate();
  const item: MediaItemWithOwner = state;
  const createdAtTimestamp =
    typeof item.created_at === 'string' ? parseInt(item.created_at, 10) : 0;

  // Check if createdAtTimestamp is a valid number
  const isValidTimestamp =
    !isNaN(createdAtTimestamp) && isFinite(createdAtTimestamp);

  // Create a Date object only if the timestamp is valid
  const createdDate = isValidTimestamp ? new Date(createdAtTimestamp) : null;

  // Convert the Date object to a string for display
  const formattedDate = createdDate
    ? createdDate.toLocaleString('fi-FI', {
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
      })
    : 'Invalid Date';
  return (
    <div className="flex flex-col items-center justify-center">
      <h3>{item.title}</h3>
      {item.media_type.includes('video') ? (
        <video controls src={item.filename}></video>
      ) : (
        <img src={item.filename} alt={item.title} />
      )}
      <Likes item={item} />
      <p>{item.description}</p>
      <p>{formattedDate}</p>
      <p>{item.filesize}</p>
      <p>{item.media_type}</p>
      <button
        onClick={() => {
          // setSelectedItem(undefined);
          navigate(-1);
        }}
      >
        Go back
      </button>
      <Comments item={item} />
    </div>
  );
};

export default Single;
