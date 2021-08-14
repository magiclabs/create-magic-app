import { useState, useEffect } from "react";
import Router from "next/router";
import { magic } from "../lib/magic";
import { useUser } from "../lib/hooks";
import LoginForm from "../components/login-form";

const Login = () => {
  let user = useUser();

  useEffect(() => {
    if (user) user.issuer && Router.push("/profile");
  }, [user]);

  const [disabled, setDisabled] = useState(false);

  async function handleLogin(email) {
    try {
      setDisabled(true); // disable login button to prevent multiple emails from being triggered

      // Trigger Magic link to be sent to user
      let didToken = await magic.auth.loginWithMagicLink({ email });

      // Validate didToken with server
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + didToken,
        },
      });

      res.status === 200 && Router.push("/");
    } catch (error) {
      setDisabled(false); // re-enable login button - user may have requested to edit their email
      console.log(error);
    }
  }

  return (
    <div className="login">
      <LoginForm disabled={disabled} onEmailSubmit={handleLogin} />
      <style jsx>{`
        .login {
          max-width: 20rem;
          margin: 40px auto 0;
          padding: 1rem;
          border: 1px solid #dfe1e5;
          border-radius: 4px;
          text-align: center;
          box-shadow: 0px 0px 6px 6px #f7f7f7;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default Login;
