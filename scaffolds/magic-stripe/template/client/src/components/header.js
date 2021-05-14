import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../lib/UserContext";
import { LifetimeContext } from "../lib/LifetimeContext";
import { CallToAction, TextButton } from "@magiclabs/ui";
import { magic } from "../lib/magic";

const Header = () => {
  const history = useHistory();
  const [user, setUser] = useContext(UserContext);
  const [, setLifetimeAccess] = useContext(LifetimeContext);

  const logout = () => {
    magic.user.logout().then(() => {
      setUser({ user: null });
      setLifetimeAccess(false);
      history.push("/login");
    });
  };

  return (
    <header>
      <nav>
        <ul>
          <li>
            <TextButton
              color="primary"
              size="sm"
              onPress={() => history.push("/")}
            >
              Free Content
            </TextButton>
          </li>
          <li>
            <TextButton
              color="primary"
              size="sm"
              onPress={() => history.push("/premium-content")}
            >
              Premium Content
            </TextButton>
          </li>
          {user?.loading ? (
            // If loading, don't display any buttons specific to the loggedIn state
            <div style={{ height: "38px" }}></div>
          ) : user?.issuer ? (
            <>
              <li>
                <TextButton
                  color="primary"
                  size="sm"
                  onPress={() => history.push("/profile")}
                >
                  Profile
                </TextButton>
              </li>
              <li>
                <TextButton color="warning" size="sm" onPress={logout}>
                  Logout
                </TextButton>
              </li>
            </>
          ) : (
            <li>
              <CallToAction
                color="primary"
                size="sm"
                onPress={() => history.push("/profile")}
              >
                Log In
              </CallToAction>
            </li>
          )}
        </ul>
      </nav>
      <style>{`
        nav {
          max-width: 45rem;
          margin: 0 auto 50px;
          padding: 1.25rem 1.25rem;
          border-bottom: 1px solid #f0f0f0;
          box-sizing: border-box;
        }
        ul {
          display: flex;
          list-style: none;
        }
        li {
          margin-right: 1.5rem;
          line-height: 38px;
        }
        li:first-child {
          margin-left: auto;
        }
      `}</style>
    </header>
  );
};

export default Header;
