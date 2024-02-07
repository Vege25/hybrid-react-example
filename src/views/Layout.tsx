import React from 'react';
import {Link, Outlet} from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <>
      <header>
        <h1>My app</h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/upload">Upload</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/logout">Logout</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>Copyright</p>
      </footer>
    </>
  );
};

export default Layout;
