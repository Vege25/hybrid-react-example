import {Link} from 'react-router-dom';
import {MediaItemWithOwner} from '../types/DBTypes';
const MediaRow = (props: {item: MediaItemWithOwner}) => {
  const {item} = props;

  return (
    <tr key={item.media_id} className="media-row">
      <td>
        <img src={item.thumbnail} alt={item.title} />
      </td>
      <td>{item.title}</td>
      <td>{item.description}</td>
      <td>{item.created_at}}</td>
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
