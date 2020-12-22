import { magic } from '../../lib/magic';
import { encryptSession } from '../../lib/iron';
import { setTokenCookie } from '../../lib/auth-cookies';
import { UserModel } from '../../lib/models/user';

export default async function login(req, res) {
  try {
    const didToken = req.headers.authorization.substr(7);
    await magic.token.validate(didToken);
    const metadata = await magic.users.getMetadataByToken(didToken);

    const userModel = new UserModel();
    // We auto-detect signups if `getUserByEmail` resolves to `undefined`
    const user =
      (await userModel.getUserByEmail(metadata.email)) ??
      (await userModel.createUser(metadata.email));
    // USER
    // {
    //   ref: Ref(Collection("users"), "284553637288477187"),
    //   ts: 1607630345585000,
    //   data: { email: 'hunter@magic.link' }
    // }
    await userModel.obtainFaunaDBToken(user); // fnED8vAGoxACAgPy7ZhBwAIDBK__VLfmwEJbgEIL0L99N6tWAgU

    const session = { ...metadata };
    const token = await encryptSession(session);
    setTokenCookie(res, token);
    res.status(200).send({ done: true });
  } catch (error) {
    res.status(error.status || 500).end(error.message);
  }
}
