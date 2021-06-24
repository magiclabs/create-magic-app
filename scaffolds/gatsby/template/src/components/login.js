import React, { useState, useCallback, useEffect } from "react"
import { navigate } from '@reach/router'
import { Link } from "gatsby"

import Layout from "./layout"
import Seo from "./seo"

import { magic } from "../lib/magic";

const Login = () => {
  const [email, setEmail] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // On mount, we check if a user is logged in.
    // If so, we'll retrieve the authenticated user's profile.
    magic.user.isLoggedIn().then(magicIsLoggedIn => {
      if (magicIsLoggedIn) {
        navigate(`/app/profile`);
      } else {
        // If no user is logged in, redirect to `/login`
        navigate(`/app/login`);
      }
    });
    
  }, []);

  /**
   * Perform login action via Magic's passwordless flow. Upon successuful
   * completion of the login flow, a user is redirected to the homepage.
   */
  const login = useCallback(async () => {
    setIsLoggingIn(true);

    try {
      await magic.auth.loginWithMagicLink({
        email
      });
      navigate(`/app/profile`);
    } catch {
      setIsLoggingIn(false);
    }
  }, [email]);

  /**
   * Saves the value of our email input into component state.
   */
  const handleInputOnChange = useCallback(event => {
    setEmail(event.target.value);
  }, []);

  return (
    <Layout>
      <Seo title="Login" />
      <h1>Please sign up or login</h1>
      <input
        type="email"
        name="email"
        required="required"
        placeholder="Enter your email"
        onChange={handleInputOnChange}
        disabled={isLoggingIn}
      />
      <button onClick={login} disabled={isLoggingIn} style={{ marginLeft: '10px' }}>Send</button>

      <p style={{ marginTop: '20px' }}>
        <Link to="/">Home</Link>
      </p>
    </Layout>
  )
}

export default Login