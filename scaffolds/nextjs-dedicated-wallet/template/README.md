This scaffold is meant to help you bootstrap your own projects with Magic's [Dedicated Wallet](https://magic.link/docs/auth/overview). Magic is a developer SDK that integrates with your application to enable passwordless Web3 onboarding.

The folder structure of this scaffold is designed to encapsulate all things Magic into one place so you can easily add or remove components and functionality. For example, all Magic-specific components are in the `src/components/magic` directory while generic UI components are in the `src/components/ui` directory.

## Project Structure
## Architecture
- `public`
- `src`
    - `components`
      - `magic`
        - `Login.tsx` - Manages the display and functionality of various login methods on the login page.
        - `auth`
            - `Discord.tsx` - Handles authentication using Discord as an OAuth provider.
            - `Facebook.tsx` - Handles authentication using Facebook as an OAuth provider.
            - `Google.tsx` - Handles authentication using Google as an OAuth provider.
            - `Twitch.tsx` - Handles authentication using Twitch as an OAuth provider.
            - `EmailOTP.tsx` - Handles authentication using email one-time password (OTP).
            - `Github.tsx` - Handles authentication using GitHub as an OAuth provider.
            - `SMSOTP.tsx` - Handles authentication using SMS one-time password (OTP).
            - `Twitter.tsx` - Handles authentication using Twitter as an OAuth provider.
        - `cards`
            - `SendTransactionCard.tsx` - Facilitates the process of sending transactions on your selected network.
            - `UserInfoCard.tsx` - Displays user information retrieved from the provider.
            - `WalletMethodsCard.tsx` - Provides user methods for managing authentication tokens, retrieving user metadata, and disconnecting the session.

        - `wallet-methods`
            - `Disconnect.tsx` - Handles the disconnection of the user's session from the application.
            - `GetIdToken.tsx` - Retrieves the ID token for the authenticated user.
            - `GetMetadata.tsx` - Retrieves metadata information about the authenticated user.
            - `UpdateEmail.tsx` - Allows the user to update their email address.

      - `ui` - Contains reusable UI components for building the user interface, including cards, forms, dashboard elements, and utility components.
        - `Card.tsx`
        - `CardHeader.tsx`
        - `CardLabel.tsx`
        - `Dashboard.tsx`
        - `Divider.tsx`
        - `ErrorText.tsx`
        - `FormButton.tsx`
        - `FormInput.tsx`
        - `MagicDashboardRedirect.tsx`
        - `Spacer.tsx`
        - `Spinner.tsx`
        - `TransactionHistory.tsx`
    - `hooks`
        - `MagicProvider.tsx` - Sets up and provides Magic authentication context using the Magic SDK and OAuth extension.
        - `Web3.tsx` - Custom hook that initializes and provides a Web3 instance using the Magic provider.
    - `pages`
        - `_app.tsx`
        - `_document.tsx`
        - `index.tsx`
    - `styles`
        - `globals.css`
    - `utils`
        - `common.ts` - Manages user authentication, including login methods, logout functionality, and saving user information to local storage.
        - `network.ts` - Defines network configurations and utilities, including URLs, chain IDs, tokens, faucet URLs, network names, and block explorer links.
        - `showToast.ts` - Displays customizable toast notifications for different message types.
        - `types.ts` - Types for `LoginProps`.
- `.env`
- `.eslintrc.json`
- `.gitignore`
- `next.config.js`
- `package.json`
- `postcss.config.js`
- `README.md`
- `tailwind.config.js`
- `tsconfig.json`

## Next.js

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
