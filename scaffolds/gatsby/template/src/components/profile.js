import React, { useEffect, useState, useCallback } from "react";
import { navigate } from '@reach/router'
import { Link } from "gatsby"

import Loading from "./loading";
import Layout from "./layout"
import Seo from "./seo"

import { magic } from "../lib/magic";

export default function Profile() {
  const [userMetadata, setUserMetadata] = useState();

  useEffect(() => {
    // On mount, we check if a user is logged in.
    // If so, we'll retrieve the authenticated user's profile.
    magic.user.isLoggedIn().then(magicIsLoggedIn => {
      if (magicIsLoggedIn) {
        magic.user.getMetadata().then(setUserMetadata);
      } else {
        // If no user is logged in, redirect to `/login`
        navigate(`/app/login`);
      }
    });
  }, []);

  /**
   * Perform logout action via Magic.
   */
  const logout = useCallback(() => {
    magic.user.logout().then(() => {
      navigate(`/app/login`);
    })
  }, []);

  return userMetadata ?
    <Layout>
      <Seo title="Profile" />
      <h1>Current user: {userMetadata.email}</h1>
      <h6>User ID: {userMetadata.issuer}</h6>
      <h6>Public Address: {userMetadata.publicAddress}</h6>
      <button onClick={logout} style={{
        background: `rebeccapurple`,
        color: 'white',
        cursor: 'pointer'
      }}>Logout</button>
      <p style={{ marginTop: '20px' }}>
        <Link to="/">Home</Link>
      </p>
    </Layout>
    : <Loading />;
}

