const Iron = require('@hapi/iron');

/* defining the cookie attributes */
const cookie = {
  maxAge: 60 * 60, // 1 hour
  secure: false, // set `true` for https only
  path: '/', // send the cookie on all requests
  httpOnly: true, // makes cookie inaccessible from browser (only transfered through http requests, and protects against XSS attacks)
  sameSite: 'lax', // cookie can only be sent from the same domain
};

const decryptCookie = async (cookie) => {
  try {
    return await Iron.unseal(cookie, process.env.TOKEN_SECRET, Iron.defaults);
  } catch (error) {
    console.log(error);
  }
};

const encryptCookie = async (metadata) => {
  try {
    return await Iron.seal(metadata, process.env.TOKEN_SECRET, Iron.defaults);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { cookie, decryptCookie, encryptCookie };
