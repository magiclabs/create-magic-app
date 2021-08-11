# Boxi
A super simple, secure social media site where you can share photos of your kitties and see other people's kitty galleries! This website leverages [Magic](https://magic.link/) to enable passwordless auth, [Next.js](https://nextjs.org/) as the UI framework and it's [API Routes](https://nextjs.org/docs/api-routes/introduction) to create Node.js serverless functions, and [Hasura](https://hasura.io/) to generate a GraphQL API to help query and mutate data stored in the [Heroku](https://dashboard.heroku.com/login) database.

# Demo
https://boxi.vercel.app/

# Quick start instructions
```txt
$ git clone https://github.com/seemcat/boxi.git
$ cd boxi
$ mv .env.local.example .env.local
$ yarn install
$ yarn dev
```

# .env.local File
```txt
NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY=your-magic-publishable-key
MAGIC_SECRET_KEY=your-magic-secret-key
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
JWT_SECRET=your-32+-character-secret
NEXT_PUBLIC_HASURA_GRAPHQL_URL=your-graphql-api-server
```

# Video Tutorial
Coming soon!