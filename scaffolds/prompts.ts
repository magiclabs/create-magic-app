import type { Questions } from 'compiled/zombi';
import type { Flags } from 'cli/flags';
import type { ValuesOf } from 'cli/types/utility-types';

export namespace PublishableApiKeyPrompt {
  export type Data = {
    publishableApiKey: 'npm' | 'yarn';
  };

  const validate = (value: string) =>
    value.startsWith('pk') ? true : '--publishable-api-key should look like `pk_live_...` or `pk_test_...`';

  export const questions: Questions<Data> = {
    type: 'input',
    name: 'publishableApiKey',
    validate,
    message: 'Enter your Magic publishable API key:',
  };

  export const flags: Flags<Data> = {
    publishableApiKey: {
      type: String,
      validate,
      description: 'The Magic publishable API key for your app.',
    },
  };
}

export namespace SecretApiKeyPrompt {
  export type Data = {
    secretApiKey: 'npm' | 'yarn';
  };

  const validate = (value: string) =>
    value.startsWith('sk') ? true : '--secret-api-key should look like `sk_live_...` or `sk_test_...`';

  export const questions: Questions<Data> = {
    type: 'input',
    name: 'secretApiKey',
    validate,
    message: 'Enter your Magic secret API key:',
  };

  export const flags: Flags<Data> = {
    secretApiKey: {
      type: String,
      validate,
      description: 'The Magic secret API key for your app.',
    },
  };
}

export namespace NpmClientPrompt {
  const clients = ['npm', 'yarn'];

  export type Data = {
    npmClient: ValuesOf<typeof clients>;
  };

  export const questions: Questions<Data> = {
    type: 'select',
    name: 'npmClient',
    message: 'Choose an NPM client:',
    choices: clients,
  };

  export const flags: Flags<Data> = {
    npmClient: {
      type: String,
      validate: (value: string) => (clients.includes(value) ? true : `\`${value}\` is not a valid NPM client.`),
      description: 'The NPM client of your choice. (one of: npm, yarn)',
    },
  };

  export function getInstallCommand(data: Data) {
    return data.npmClient === 'npm' ? 'npm install' : 'yarn install';
  }

  export function getStartCommand(packageJsonScript: string) {
    return (data: Data) => {
      return data.npmClient === 'npm' ? `npm run ${packageJsonScript}` : `yarn ${packageJsonScript}`;
    };
  }
}

export namespace SocialLoginsPrompt {
  export const providers = ['facebook', 'google', 'apple', 'twitter', 'linkedin', 'github', 'gitlab', 'bitbucket'];
  export type SocialLoginProvider = ValuesOf<typeof providers>;

  export type Data = {
    socialLogin: SocialLoginProvider[];
  };

  export const questions: Questions<Data> = {
    type: 'multiselect',
    name: 'socialLogin',
    message: 'Choose your social login providers:',
    choices: providers,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: This is a bug in the typing from `zombi`. `validate` should be an acceptable field...
    validate: (value: SocialLoginProvider[]) => {
      if (!value.length) {
        return `Please select at least one social login provider.`;
      }

      return true;
    },
  };

  export const flags: Flags<Data> = {
    socialLogin: {
      type: [String],
      description: `The social login provider(s) of your choice. You can provide this flag multiple times to select multiple providers. (one of: ${providers.join(
        ', ',
      )})`,
      validate: (value: SocialLoginProvider[]) => {
        const invalid: string[] = [];

        value.forEach((i) => {
          if (!providers.includes(i)) invalid.push(i);
        });

        if (invalid.length) {
          return `Received incompatible social login provider(s): (${invalid.join(', ')})`;
        }
      },
    },
  };
}
