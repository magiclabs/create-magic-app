import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { magic } from "../magic";
import Loading from "./Loading";

export default function Callback() {
  const history = useHistory();

  useEffect(() => {
    // On mount, we try to login with a Magic credential in the URL query.
    magic.auth.loginWithCredential().finally(() => {
      history.push("/");
    });
  }, []);

  return <Loading />;
}

