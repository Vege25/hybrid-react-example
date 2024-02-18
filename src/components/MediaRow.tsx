import {Link} from 'react-router-dom';
import {MediaItemWithOwner} from '../types/DBTypes';
import FriendElement from './FriendElement';
import {useUserContext} from '../hooks/contextHooks';
const MediaRow = (props: {item: MediaItemWithOwner}) => {
  const {item} = props;
  const {user} = useUserContext();

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
      <div className="mx-4 flex items-center justify-between">
        <FriendElement friend={item.owner} />
        <p>{formattedDate}</p>
      </div>
      <div className="flex h-96 w-full items-center justify-center">
        <img
          className="max-h-96 w-full rounded-2xl object-cover"
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
      {user &&
        (user.user_id === item.owner.user_id ||
          user.level_name === 'Admin') && (
          <>
            <button
              className="bg-slate-700 p-2 hover:bg-slate-950"
              onClick={() => console.log('modify', item)}
            >
              Modify
            </button>
            <button
              className="bg-slate-800 p-2 hover:bg-slate-950"
              onClick={() => console.log('delete', item)}
            >
              Delete
            </button>
          </>
        )}
    </div>
  );
};

export default MediaRow;
