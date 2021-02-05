import React, { useCallback, useState } from "react";
import { useHistory } from "react-router";
import { magic, socialLogins } from "../magic";

export default function Login() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const history = useHistory();

  /**
   * Perform login action via Magic's OAuth flow. Upon successuful
   * completion of the login flow, a user is redirected to the homepage.
   */
  const login = useCallback(async (provider) => {
    setIsLoggingIn(true);

    try {
      await magic.oauth.loginWithRedirect({
        provider,
        redirectURI: new URL("/callback", window.location.origin).href,
      });
      history.push("/");
    } catch {
      setIsLoggingIn(false);
    }
  }, []);

  return (
    <div className="container">
      <h1>Please sign up or login</h1>
      {socialLogins.map(provider => {
        return React.createElement(require(`../social-logins/${provider}`).default.Button, {
          onClick: () => login(provider),
          disabled: isLoggingIn,
          key: provider,
        });
      })}
    </div>
  );
}

