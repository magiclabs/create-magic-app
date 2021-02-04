import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { magic } from '../magic';

export default function Callback() {
  const history = useHistory();

  useEffect(() => {
    // On mount, we try to login with a Magic credential in the URL query.
    magic.auth.loginWithCredential().finally(() => {
      history.push('/');
    });
  }, []);

  return (
    <div className="container">
      <p>Loading...</p>
    </div>
  );
}

