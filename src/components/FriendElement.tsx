import UserProfileIcon from './UserProfileIcon';
import {Friend} from '../types/MessageTypes';

const FriendElement = (props: {friend: Friend}) => {
  const {friend} = props;

  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="flex flex-row items-center gap-2" key={friend.user_id}>
      <UserProfileIcon
        userInitial={
          friend?.username
            ? capitalizeFirstLetter(Array.from(friend?.username)[0])
            : 'G'
        }
      />
      <p className="text-lg font-bold capitalize">{friend.username}</p>
    </div>
  );
};

export default FriendElement;
