import {useEffect, useState} from 'react';
import {Link, Outlet} from 'react-router-dom';
import {useUserContext} from '../hooks/contextHooks';
import UserProfileIcon from '../components/UserProfileIcon';

const Layout = () => {
  const {user, handleAutoLogin} = useUserContext();
  const [isBouncing, setIsBouncing] = useState(false);

  // If there is no user, try to auto-login
  if (!user) {
    handleAutoLogin();
  }

  useEffect(() => {
    // Animate bounce after 10 seconds
    const bounceTimeout = setTimeout(() => {
      setIsBouncing(true);
    }, 10000);

    return () => clearTimeout(bounceTimeout);
  }, []);

  useEffect(() => {
    console.log('bouncing', isBouncing);

    // Hide the tip after 10 seconds of showing the bounce
    if (isBouncing) {
      const hideTipTimeout = setTimeout(() => {
        setIsBouncing(false);
      }, 10000);

      // Clear hideTipTimeout when the component unmounts or when isBouncing changes
      return () => clearTimeout(hideTipTimeout);
    }
  }, [isBouncing]);

  const userInitial = user?.username ? Array.from(user?.username)[0] : 'G';
  return (
    <>
      <header className="m-auto w-full max-w-xl p-2">
        <nav className="">
          <ul className="relative mx-10 flex flex-row items-center justify-between gap-2 ">
            <li>
              <Link to="/friends">
                <i className="fa-solid fa-user-group"></i>
              </Link>
            </li>
            <li>
              <Link to="/">
                <h2 className="text-xl font-bold">BeProductive</h2>
              </Link>
            </li>
            <li>
              {user ? (
                <Link to="/profile">
                  <UserProfileIcon userInitial={userInitial} />
                </Link>
              ) : (
                <Link to="/login">Login</Link>
              )}
            </li>
          </ul>
          <Link to="/upload">
            <div
              className={`fixed bottom-4 left-1/2 -translate-x-1/2 transform ${
                isBouncing ? 'animate-bounce' : ''
              }`}
            >
              {isBouncing && isBouncing === true && (
                <div
                  className={`absolute bottom-20 left-1/2 -translate-x-1/2 opacity-${isBouncing ? '100' : '0'} duration-500 ease-in-out`}
                >
                  <div className="relative mb-10 bg-slate-300 p-4 text-center text-black">
                    <p className="relative text-nowrap">Spread productivity!</p>
                    <div className="absolute left-1/2 top-10 -z-10 h-8 w-8 -translate-x-1/2 rotate-45 bg-slate-300"></div>
                  </div>
                </div>
              )}
              <div className="relative h-20 w-20 cursor-pointer rounded-full border-4 text-white"></div>
            </div>
          </Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
