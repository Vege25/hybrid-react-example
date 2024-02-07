import {Link} from 'react-router-dom';
import {MediaItemWithOwner} from '../types/DBTypes';
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
    ? createdDate.toLocaleString('fi-FI')
    : 'Invalid Date';

  return (
    <tr key={item.media_id} className="media-row">
      <td>
        <img src={item.thumbnail} alt={item.title} />
      </td>
      <td>{item.title}</td>
      <td>{item.description}</td>
      <td>{formattedDate}</td>
      <td>{item.filesize}</td>
      <td>{item.media_type}</td>
      <td>{item.owner.username}</td>
      <td>
        <Link to="/single" state={item}>
          View
        </Link>
      </td>
    </tr>
  );
};

export default MediaRow;
