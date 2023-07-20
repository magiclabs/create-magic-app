import type { Questions } from 'zombi';
import type { Flags } from 'core/flags';
import type { ValuesOf } from 'core/types/utility-types';

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

  export const flags: Flags<Partial<Data>> = {
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

  export const flags: Flags<Partial<Data>> = {
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

  export const flags: Flags<Partial<Data>> = {
    npmClient: {
      type: String,
      validate: (value: string) => (clients.includes(value) ? true : `\`${value}\` is not a valid NPM client.`),
      description: 'The NPM client of your choice. (one of: npm, yarn)',
    },
  };

  export function getInstallCommand(data: Data) {
    return data.npmClient === 'npm' ? ['npm', 'install'] : ['yarn', 'install'];
  }

  export function getStartCommand(packageJsonScript: string) {
    return (data: Data) => {
      return data.npmClient === 'npm' ? ['npm', 'run', packageJsonScript] : ['yarn', packageJsonScript];
    };
  }
}

export namespace SocialLoginsPrompt {
  export const providers = [
    'apple',
    'bitbucket',
    'discord',
    'facebook',
    'github',
    'gitlab',
    'google',
    'linkedin',
    'twitter',
    'twitch',
    'microsoft',
  ];

  export type Data = {
    socialLogin: string[];
  };

  export const questions: Questions<Data> = {
    type: 'multiselect',
    name: 'socialLogin',
    message: 'Choose your social login providers:',
    choices: providers,
    validate: (value) => {
      if (!value.length) {
        return `Please select at least one social login provider.`;
      }

      return true;
    },
  };

  export const flags: Flags<Partial<Data>> = {
    socialLogin: {
      type: [String],
      description: `The social login provider(s) of your choice. You can provide this flag multiple times to select multiple providers. (one of: ${providers.join(
        ', ',
      )})`,
      validate: (value) => {
        console.log('value');
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

export namespace BlockchainNetworkPrompt {
  export type Data = {
    networkUrl: string;
  };

  export const questions: Questions<Data> = {
    type: 'select',
    name: 'networkUrl',
    message: 'Select the blockchain network url you wish to connect',
    choices: ['https://polygon-rpc.com/', 'https://rpc-mumbai.maticvigil.com'],
  };

  const validate = (value: string) =>
    value.match(/^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/)
      ? true
      : `${value} is not a valid URL`;

  export const flags: Flags<Partial<Data>> = {
    networkUrl: {
      alias: 'n',
      type: String,
      validate,
      description: 'The blockchain network url you wish to connect',
    },
  };
}

export namespace AuthTypePrompt {
  const authMethods = ['Email OTP', 'SMS OTP', 'Google', 'Github', 'Discord', 'Twitter', 'Twitch', 'Login Form'];
  export type Data = {
    selectedAuthTypes: string[];
  };

  export const questions: Questions<Data> = {
    type: 'multiselect',
    name: 'selectedAuthTypes',
    message: 'Choose auth methods:',
    choices: authMethods,
    validate: (value) => {
      if (!value.length) {
        return `Please select at least one social login provider.`;
      }

      return true;
    },
  };

  export const flags: Flags<Partial<Data>> = {
    selectedAuthTypes: {
      type: [String],
      description: `The auth method(s) of your choice. You can provide this flag multiple times to select multiple methods. (one of: ${authMethods.join(
        ', ',
      )})`,
      validate: (value) => {
        const invalid: string[] = [];

        value.forEach((i) => {
          if (!authMethods.includes(i)) invalid.push(i);
        });

        if (invalid.length) {
          return `Received unknown auth method(s): (${invalid.join(', ')})`;
        }
      },
    },
  };
}
