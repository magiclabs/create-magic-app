const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { magic } = require('../lib/magic');
const { cookie, decryptCookie, encryptCookie } = require('../lib/cookie');
const { serialize } = require('cookie');
const { UserModel } = require('../lib/models/user');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/user', async (req, res) => {
  try {
    if (!req.cookies.auth) return res.json({ user: null });
    let session = await decryptCookie(req.cookies.auth);
    res.status(200).json({ user: session });
  } catch (error) {
    console.log(error);
  }
});

router.post('/login', async (req, res) => {
  try {
    const didToken = req.headers.authorization.substr(7);
    await magic.token.validate(didToken);
    const metadata = await magic.users.getMetadataByToken(didToken);

    const userModel = new UserModel();
    // We auto-detect signups if `getUserByEmail` resolves to `undefined`
    const user =
      (await userModel.getUserByEmail(metadata.email)) ||
      (await userModel.createUser(metadata.email));
    // USER
    // {
    //   ref: Ref(Collection("users"), "284553637288477187"),
    //   ts: 1607630345585000,
    //   data: { email: 'hunter@magic.link' }
    // }
    await userModel.obtainFaunaDBToken(user); // fnED8vAGoxACAgPy7ZhBwAIDBK__VLfmwEJbgEIL0L99N6tWAgU

    const token = await encryptCookie(metadata);
    await res.setHeader('Set-Cookie', serialize('auth', token, cookie));
    res.status(200).send({ done: true });
  } catch (error) {
    console.log(error);
  }
});

router.get('/logout', async (req, res) => {
  try {
    if (!req.cookies.auth) return res.json({}).end();
    let session = await decryptCookie(req.cookies.auth);
    await magic.users.logoutByIssuer(session.issuer);
    res.setHeader(
      'Set-Cookie',
      serialize('auth', '', {
        ...cookie,
        expires: new Date(Date.now() - 1),
      })
    );
    res.writeHead(302, { Location: `${process.env.CLIENT_URL}/login` });
    res.end();
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
