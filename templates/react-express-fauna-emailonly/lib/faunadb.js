const faunadb = require('faunadb');

/** Alias to `faunadb.query` */
exports.q = faunadb.query;

/**
 * Creates an authenticated FaunaDB client
 * configured with the given `secret`.
 */
function getClient(secret) {
  return new faunadb.Client({ secret });
}

/** FaunaDB Client configured with our server secret. */
exports.adminClient = getClient(process.env.FAUNADB_SECRET_KEY);
