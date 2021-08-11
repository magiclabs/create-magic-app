import Link from "next/link";
import { useUser } from "../lib/hooks";
import { CallToAction, TextButton } from "@magiclabs/ui";

const Header = () => {
  const user = useUser();

  return (
    <header>
      <nav>
        <div className="title">Boxi</div>
        <ul>
          {user?.loading ? (
            // If loading, don't display any buttons specific to the loggedIn state
            <div style={{ height: "38px" }}></div>
          ) : user?.issuer ? (
            <>
              <li>
                <Link href="/">
                  <TextButton color="primary" size="sm">
                    Home
                  </TextButton>
                </Link>
              </li>
              <li>
                <Link href="/profile">
                  <TextButton color="primary" size="sm">
                    Profile
                  </TextButton>
                </Link>
              </li>
              <li>
                <Link href="/api/logout">
                  <TextButton color="warning" size="sm">
                    Logout
                  </TextButton>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login">
                  <CallToAction color="primary" size="sm">
                    Login
                  </CallToAction>
                </Link>
              </li>
              <li>
                <Link href="/signup">
                  <CallToAction color="primary" size="sm">
                    Sign up
                  </CallToAction>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <style jsx>{`
        nav {
          max-width: 45rem;
          margin: 0 auto 50px;
          padding: 1.25rem 1.25rem;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }
        ul {
          display: flex;
          justify-content: space-between;
          align-items: center;
          list-style: none;
        }
        li {
          margin-right: 1.5rem;
          line-height: 38px;
        }
        li:first-child {
          margin-left: auto;
        }
        .title {
          padding: 20px;
          font-size: 40px;
          font-weight: bolder;
        }
      `}</style>
    </header>
  );
};

export default Header;
