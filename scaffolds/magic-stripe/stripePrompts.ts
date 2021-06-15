import type { Questions } from 'compiled/zombi';
import type { Flags } from 'core/flags';

export namespace StripePublishableApiKeyPrompt {
  export type Data = {
    stripePublishableApiKey: 'npm' | 'yarn';
  };

  const validate = (value: string) =>
    value.startsWith('pk') ? true : '--publishable-api-key should look like `pk_live_...` or `pk_test_...`';

  export const questions: Questions<Data> = {
    type: 'input',
    name: 'stripePublishableApiKey',
    validate,
    message: 'Enter your Stripe publishable API key:',
  };

  export const flags: Flags<Data> = {
    stripePublishableApiKey: {
      type: String,
      validate,
      description: 'The Stripe publishable API key for your app.',
    },
  };
}

export namespace StripeSecretApiKeyPrompt {
  export type Data = {
    stripeSecretApiKey: 'npm' | 'yarn';
  };

  const validate = (value: string) =>
    value.startsWith('sk') ? true : '--secret-api-key should look like `sk_live_...` or `sk_test_...`';

  export const questions: Questions<Data> = {
    type: 'input',
    name: 'stripeSecretApiKey',
    validate,
    message: 'Enter your Stripe secret API key:',
  };

  export const flags: Flags<Data> = {
    stripeSecretApiKey: {
      type: String,
      validate,
      description: 'The Stripe secret API key for your app.',
    },
  };
}
