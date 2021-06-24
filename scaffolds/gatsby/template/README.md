# Gatsby Magic Starter for passwordless authentication

This gatsby auth starter implements a passwordless authentication using email magic link provided by [Magic](https://magic.link).

## 🚀 Quick start

1.  **Create a Gatsby site.**

    Use the Gatsby CLI to create a new site, specifying the gatsby-magic-starter for passwordless authentication.

    ```shell
    # create a new Gatsby site using the gatsby-magic-starter
    gatsby new my-gatsby-magic-starter https://github.com/magiclabs/gatsby-magic-starter
    ```

1.  **Get Magic's PUBLISHABLE KEY**

    Sign up with Magic for free and get your `GATSBY_MAGIC_PUBLISHABLE_API_KEY`
    ![Magic Dashboard](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rpp4w4g0ebm9jq2c84u8.png)

    ```shell
    cp .env.example .env.development
    ```

    `.env.development`

    ```text
    GATSBY_MAGIC_PUBLISHABLE_API_KEY=pk_live_********
    ```

1.  **Start developing.**

    Navigate into your new site’s directory and start it up.

    ```shell
    cd my-gatsby-magic-starter/
    gatsby develop
    ```

1.  **Open the source code and start editing!**

    Your site is now running at `http://localhost:8000`!

    Open the `my-gatsby-magic-starter` directory in your code editor of choice and edit `src/pages/index.js`. Save your changes and the browser will update in real time!
