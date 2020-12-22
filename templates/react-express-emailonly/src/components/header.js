import { useUser } from '../lib/hooks';
import { Link } from 'react-router-dom';

const Header = () => {
  const user = useUser();

  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to='/'>
              <span>Home</span>
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to='/profile'>
                  <span>Profile</span>
                </Link>
              </li>
              <li>
                <a href={`${process.env.REACT_APP_SERVER_URL}/api/logout`}>Logout</a>
              </li>
            </>
          ) : (
            <li>
              <Link to='/login'>
                <span>Login</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>
      <style>{`
        nav {
          max-width: 42rem;
          margin: 0 auto;
          padding: 0.2rem 1.25rem;
        }
        ul {
          display: flex;
          list-style: none;
          margin-left: 0;
          padding-left: 0;
        }
        li {
          margin-right: 1rem;
        }
        li:first-child {
          margin-left: auto;
        }
        a {
          color: #fff;
          text-decoration: none;
        }
        header {
          color: #fff;
          background-color: #333;
        }
      `}</style>
    </header>
  );
};

export default Header;
