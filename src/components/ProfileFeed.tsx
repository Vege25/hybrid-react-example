import {useEffect} from 'react';
import {useMedia} from '../hooks/apiHooks';
import {Link} from 'react-router-dom';

const ProfileFeed = () => {
  const {myMediaArray, getMyMedia} = useMedia();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMyMedia(token);
    }
  }, []);

  return (
    <div className="m-auto w-full max-w-xl px-2">
      <h2 className="text-center text-2xl font-bold">My Feed</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {myMediaArray &&
          myMediaArray.length > 0 &&
          myMediaArray.map((item) => (
            <Link
              key={item.media_id}
              to="/single"
              state={item}
              className="relative overflow-hidden rounded-lg duration-200 ease-in-out hover:scale-105"
            >
              <div className="h-full w-full ">
                <img
                  className="h-full w-full object-cover"
                  src={item.thumbnail}
                  alt={item.title}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100">
                  {/* Add any additional overlay content or actions */}
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default ProfileFeed;
