## Quick start

```
$ git clone <this_repo_url>
$ cd example-nextjs
$ cp .env.local.example .env.local
```

Go to the Magic dashboard to grab your API keys and set the below variables in your `.env.local` file. Make sure to change the `TOKEN_SECRET` as well.

`NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY=pk_`
`MAGIC_SECRET_KEY=sk_`

```
$ yarn install
$ yarn dev
```

Then follow the instructions in our docs for setting up social logins.

If you open up localhost:3000, your application should be running!

## Demo

https://magic-demo.vercel.app

### Technologies

- Magic
- Nextjs
