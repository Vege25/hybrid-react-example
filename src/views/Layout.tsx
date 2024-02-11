import React from 'react';
import {Link, Outlet} from 'react-router-dom';
import {useUserContext} from '../hooks/contextHooks';
import UserProfileIcon from '../components/UserProfileIcon';

const Layout: React.FC = () => {
  const {user, handleAutoLogin} = useUserContext();

  if (!user) {
    handleAutoLogin();
  }
  const userInitial = user?.username ? Array.from(user?.username)[0] : 'G';
  return (
    <>
      <header className="m-auto w-full max-w-xl p-2">
        <nav className="">
          <ul className=" flex relative gap-2 flex-row justify-between mx-10 items-center">
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
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="relative w-20 h-20 border-4 cursor-pointer text-white rounded-full"></div>
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
