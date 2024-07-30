This scaffold is meant to help you bootstrap your own projects with Magic's [Dedicated Wallet](https://magic.link/docs/auth/overview). Magic is a developer SDK that integrates with your application to enable passwordless Web3 onboarding.

The folder structure of this scaffold is designed to encapsulate all things Magic into one place so you can easily add or remove components and functionality. For example, all Magic-specific components are in the `src/components/magic` directory while generic UI components are in the `src/components/ui` directory.

## Usage

This project uses Next.js but relies on fairly standard React components and hooks. Magic-related components are in the `/src/components/magic` directory, all other UI components are in the `/src/components/ui` directory, utility functions are in `/src/utils` and hooks are in the `/src/hooks` directory.

Use this project as a reference for how to use this template or implement Magic in your own project. Key areas to look at include:

### Custom Hooks
In the `/src/hooks` directory, the `MagicProvider` hook sets up and provides a Magic instance for using the Magic SDK and OAuth extension. Additionally, the `Web3.tsx` hook initializes and provides a Web3 instance using the Magic provider.

### Login Functionality 
The `Login.tsx` component, located in `/src/components/magic`, manages the display and functionality of various login methods on the login page. It is a central piece for handling user authentication.

One thing to note is that whenever `getInfo` is called from any of the authentication providers, the user session is rehydrated.

Here is a list of the available authentication methods:
- `Discord.tsx` - Handles authentication using Discord OAuth.
- `Facebook.tsx` - Handles authentication using Facebook OAuth.
- `Google.tsx` - Handles authentication using Google OAuth.
- `Twitch.tsx` - Handles authentication using Twitch OAuth.
- `EmailOTP.tsx` - Handles authentication using email one-time password (OTP).
- `Github.tsx` - Handles authentication using GitHub OAuth.
- `SMSOTP.tsx` - Handles authentication using SMS one-time password (OTP).
- `Twitter.tsx` - Handles authentication using Twitter OAuth.

### User Interaction Components

- `/src/components/magic/auth`: This contains all of the authentication methods.

- `/src/components/magic/cards`: The `SendTransactionCard.tsx` component facilitate transaction processes, `UserInfoCard.tsx` displays user information, `WalletMethodsCard.tsx` manages authentication tokens and user metadata and `SmartContract.tsx` interacts with a basic storage contract. 

- `/src/components/magic/wallet-methods`: This directory includes several components that provide specific functionalities:
    - `Disconnect.tsx` handles the disconnection of the user's session from the application.
    - `GetIdToken.tsx` retrieves the ID token for the authenticated user.
    - `GetMetadata.tsx` retrieves metadata information about the authenticated user. This will rehydrate the user session every time it is rendered. It does this when calling the `getInfo` function. The user session is rehydrated whenever `getInfo` is invoked
    - `UpdateEmail.tsx` allows the user to update their email address.

### Utility Functions
The `/src/utils` directory includes utility files that support various aspects of the application:
- `common.ts` manages user authentication processes. The `logout` function handle the process of logging out a user and clearing their authentication data, while `saveUserInfo` saves the user's token, login method, and address to local storage.
- `network.ts` defines network configurations and utilities, such as URLs, chain IDs, tokens, and block explorer links.
- `showToast.ts` handles customizable toast notifications.
- `smartContract.ts` contains functions and configurations for interacting with smart contracts, such as retrieving contract IDs, determining testnet status, generating hash links, and defining contract ABIs.

These utilities are essential for supporting various aspects of the application.

### UI Components
The `/src/components/ui` directory contains reusable UI components for building the user interface. This includes components for creating and styling cards (`Card`, `CardHeader`, `CardLabel`), layout elements for the dashboard (`Dashboard`), separators (`Divider`), error messages (`ErrorText`), form elements (`FormButton`, `FormInput`), redirection handling within the Magic dashboard (`MagicDashboardRedirect`), spacing elements (`Spacer`), loading indicators (`Spinner`), and displaying transaction history (`TransactionHistory`).
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
