
# Demo
Here's a demo of the Magic x Stripe app: https://cryptic-waters-25194.herokuapp.com/.

# Quick Start Instructions

## Magic Setup
Create a Magic account and then grab your `REACT_APP_MAGIC_PUBLISHABLE_KEY` and `MAGIC_SECRET_KEY` from your [**Magic Dashboard**](https://dashboard.magic.link). 

## Stripe Setup
Create a Stripe account and then grab your `REACT_APP_STRIPE_PK_KEY` and `STRIPE_SECRET_KEY` from your [**Stripe Dashboard**](https://dashboard.stripe.com/test/dashboard).

## Start your Express Server

1. `git clone https://github.com/magiclabs/magic-stripe.git`
2. `cd magic-stripe`
3. `mv .env.example .env`
4. Replace `MAGIC_SECRET_KEY` and `STRIPE_SECRET_KEY` with the appropriate values you just copied. Your `.env` file should look something like this:
   ```txt
   MAGIC_SECRET_KEY=sk_test_XXX
   CLIENT_URL=http://localhost:3000
   STRIPE_SECRET_KEY=sk_test_XXX
   ```
5. `yarn`
6. `node server.js`

**Note**: Running `yarn` helped us pull the dependencies we need for our server, including the Stripe Node library.

## Start your React Client

1. `cd client`
2. `mv .env.example .env`
3. Replace `REACT_APP_MAGIC_PUBLISHABLE_KEY` and `REACT_APP_STRIPE_PK_KEY` with the appropriate values you just copied. Your `.env` file should look something like this:
   ```txt
   REACT_APP_MAGIC_PUBLISHABLE_KEY=pk_test_XXX
   REACT_APP_CLIENT_URL=http://localhost:3000
   REACT_APP_SERVER_URL=http://localhost:8080
   REACT_APP_STRIPE_PK_KEY=pk_test_XXX
   ```
4. `yarn`
5. `yarn start`

**Note**: Running `yarn` helped us pull the dependencies we need for our client, including Stripe.js and the Stripe Elements UI library (*both needed to stay PCI compliant; they ensure that card details go directly to Stripe and never reach your server*.)

# Magic React Storybook
This tutorial was built using [**Magic React Storybook**](https://magic-storybook.vercel.app/?path=/story/docs-intro--page). If you wish to swap the Magic UI components out for your own custom CSS, delete `@magiclabs/ui` and `framer-motion`from your `client/package.json` dependencies.

# Tutorial
For a step-by-step tutorial on how to integrate Magic with Stripe: [https://magic.link/posts/magic-stripe](https://magic.link/posts/magic-react-express). 🪄🍰
