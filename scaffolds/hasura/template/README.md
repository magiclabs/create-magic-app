**Note one**: This template assumes you have created a table in your Hasura console called `users` with two columns, `issuer` (primary key) and `email`.

**Note two**: the `JWT_SECRET` variable in `.env.local` should match the `key` value set in your `HASURA_GRAPHQL_JWT_SECRET` env variable. This is so Hasura can verify the JWT token sent inthe Authorization header when querying the database. You can set this in your Hasura project dashboard under "Env Vars". Hasura will throw an error if the `key` is less than 32 characters.

#### For example

HASURA_GRAPHQL_JWT_SECRET:

```
{
  "key": "abcdefghijklmnopqrstuvwxyz1234567890",
  "type": "HS256"
}
```

In `.env.local`: JWT_SECRET=abcdefghijklmnopqrstuvwxyz1234567890
