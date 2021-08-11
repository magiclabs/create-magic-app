import jwt from "jsonwebtoken";
import { setTokenCookie } from "../../lib/cookies";

export default async function user(req, res) {
  try {
    if (!req.cookies.token) return res.json({ user: null });

    let token = req.cookies.token;
    let user = jwt.verify(token, process.env.JWT_SECRET);
    let { issuer, publicAddress, email } = user;

    // Refresh the JWT for the user each time they send a request
    // to /user so they only get logged out after SESSION_LENGTH_IN_DAYS of inactivity
    let newToken = jwt.sign(
      {
        issuer,
        publicAddress,
        email,
        exp:
          Math.floor(Date.now() / 1000) +
          60 * 60 * 24 * process.env.SESSION_LENGTH_IN_DAYS,
        "https://hasura.io/jwt/claims": {
          "x-hasura-allowed-roles": ["user"],
          "x-hasura-default-role": "user",
          "x-hasura-user-id": `${issuer}`,
        },
      },
      process.env.JWT_SECRET
    );

    // send JWT in response to the client, necessary for API requests to Hasura
    user.token = newToken;
    setTokenCookie(res, newToken);

    res.status(200).json({ user });
  } catch (error) {
    res.status(200).json({ user: null });
  }
}
