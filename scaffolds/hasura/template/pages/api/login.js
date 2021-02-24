import { Magic } from '@magic-sdk/admin';
import jwt from 'jsonwebtoken';

const magic = new Magic(process.env.MAGIC_SECRET_KEY);

export default async function login(req, res) {
  try {
    // Grab auth token from Authorization header
    const didToken = req.headers.authorization.substr(7);

    // Validate auth token with Magic
    await magic.token.validate(didToken);

    // Grab user data from auth token
    const { email, issuer } = await magic.users.getMetadataByToken(didToken);

    // Create a JWT, including user data which we use when saving new user in Hasura
    const token = jwt.sign(
      {
        email,
        issuer,
        'https://hasura.io/jwt/claims': {
          'x-hasura-allowed-roles': ['admin'],
          'x-hasura-default-role': 'admin',
          'x-hasura-user-id': `${issuer}`,
        },
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // one week
      },
      process.env.JWT_SECRET
    );

    // Check if user trying to log in already exists
    const newUser = await isNewUser(issuer, token);

    // If not, create a new user in Hasura
    newUser && (await createNewUser(issuer, email, token));

    res.status(200).json({ authenticated: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function isNewUser(issuer, token) {
  let query = {
    query: `{
      users( where: {issuer: {_eq: "${issuer}"}}) {
        email
      }
    }`,
  };
  try {
    let data = await queryHasura(query, token);
    return data?.users.length ? false : true;
  } catch (error) {
    console.log(error);
  }
}

async function createNewUser(issuer, email, token) {
  let query = {
    query: `mutation {
      insert_users_one( object: { issuer: "${issuer}", email: "${email}" }) {
        email
      }
    }`,
  };
  try {
    await queryHasura(query, token);
  } catch (error) {
    console.log(error);
  }
}

async function queryHasura(query, token) {
  try {
    let res = await fetch(process.env.HASURA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(query),
    });
    let { data } = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
