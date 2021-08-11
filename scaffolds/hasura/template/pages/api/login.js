import { magic } from "../../lib/magicAdmin";
import jwt from "jsonwebtoken";
import { setTokenCookie } from "../../lib/cookies";

export default async function login(req, res) {
  try {
    const didToken = req.headers.authorization.substr(7);
    const username = req.body?.username;

    // Validate Magic's DID token
    await magic.token.validate(didToken);

    const metadata = await magic.users.getMetadataByToken(didToken);

    // Create JWT
    let token = jwt.sign(
      {
        ...metadata,
        "https://hasura.io/jwt/claims": {
          "x-hasura-allowed-roles": ["user"],
          "x-hasura-default-role": "user",
          "x-hasura-user-id": `${metadata.issuer}`,
        },
        exp:
          Math.floor(Date.now() / 1000) +
          60 * 60 * 24 * process.env.SESSION_LENGTH_IN_DAYS,
      },
      process.env.JWT_SECRET
    );

    // Check if user trying to log in already exists
    let newUser = await isNewUser(metadata.issuer, token);

    // If not, create a new user in Hasura
    newUser && (await createNewUser(metadata, token, username));

    setTokenCookie(res, token);
    res.status(200).send({ done: true });
  } catch (error) {
    console.log(error);
    res.status(500).end();
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

async function createNewUser(
  { issuer, publicAddress, email },
  token,
  username
) {
  let query = {
    query: `mutation {
      insert_users_one(object: 
        { 
          email: "${email}", 
          issuer: "${issuer}", 
          publicAddress: "${publicAddress}", 
          username: "${username}" 
        }) 
        {
        email
        username
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
    let res = await fetch(process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(query),
    });
    let { data } = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
