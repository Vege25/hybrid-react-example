import {MediaItem} from '../types/DBTypes';
const MediaRow = (props: {
  item: MediaItem;
  setSelectedItem: (item: MediaItem | undefined) => void;
}) => {
  const {item, setSelectedItem} = props;

  const handleView = () => {
    setSelectedItem(item);
  };

  return (
    // TODO: move <tr> element  for each item property from Home.tsx here
    <tr className="media-row">
      <td>
        <img src={item.thumbnail} alt={item.title} />
      </td>
      <td>{item.title}</td>
      <td>{item.description}</td>
      <td>{new Date(item.created_at).toLocaleString('fi-FI')}</td>
      <td>{item.filesize}</td>
      <td>{item.media_type}</td>
      <td>
        <button onClick={handleView}>View</button>
      </td>
    </tr>
  );
};

export default MediaRow;
