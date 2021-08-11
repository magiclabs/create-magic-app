import { magic } from "../../lib/magicAdmin";
import { removeTokenCookie } from "../../lib/cookies";
import jwt from "jsonwebtoken";

export default async function logout(req, res) {
  try {
    if (!req.cookies.token)
      return res.status(401).json({ message: "User is not logged in" });
    let token = req.cookies.token;
    let user = jwt.verify(token, process.env.JWT_SECRET);
    removeTokenCookie(res);

    // Add the try/catch because a user's session may have
    // already expired with Magic (expires 7 days after login)
    try {
      await magic.users.logoutByIssuer(user.issuer);
    } catch (error) {
      console.log("Users session with Magic already expired");
    }
    res.writeHead(302, { Location: "/login" });
    res.end();
  } catch (error) {
    res.status(401).json({ message: "User is not logged in" });
  }
}
