import {Link} from 'react-router-dom';
import {MediaItemWithOwner} from '../types/DBTypes';
import FriendElement from './FriendElement';
const MediaRow = (props: {item: MediaItemWithOwner}) => {
  const {item} = props;

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
    <div key={item.media_id} className="media-row">
      <div className="flex mx-4 justify-between items-center">
        <FriendElement friend={item.owner} />
        <p>{formattedDate}</p>
      </div>
      <div className="flex w-full h-96 items-center justify-center">
        <img
          className="w-full max-h-96 object-cover rounded-2xl"
          src={item.thumbnail}
          alt={item.title}
        />
      </div>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <p>
        <Link to="/single" state={item}>
          View
        </Link>
      </p>
    </div>
  );
};

export default MediaRow;
