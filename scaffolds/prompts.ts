/* eslint-disable @typescript-eslint/ban-ts-comment */

import type { Questions } from 'zombi';
import type { Flags } from 'core/flags';
import type { ValuesOf } from 'core/types/utility-types';

export namespace PublishableApiKeyPrompt {
  export type Data = {
    publishableApiKey: string;
  };

  const validate = (value: string) =>
    value === '' || value.startsWith('pk')
      ? true
      : '--publishable-api-key should look like `pk_live_...` or `pk_test_...`';

  export const questions: Questions<Data> = (() => {
    const question: Questions<Data> = {
      type: 'input',
      name: 'publishableApiKey',
      message: 'Enter Magic publishable API key from https://dashboard.magic.link:',
      // @ts-ignore
      hint: '(leave blank to skip for now)',
      validate,
    };

    return question;
  })();

  export const flags: Flags<Partial<Data>> = {
    publishableApiKey: {
      type: String,
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

  export const flags: Flags<Partial<Data>> = {
    npmClient: {
      type: String,
      validate: (value: string) => (clients.includes(value) ? true : `\`${value}\` is not a valid NPM client.`),
      description: 'The NPM client of your choice. (one of: npm, yarn)',
    },
  };

  export function getInstallCommand(data: Data) {
    return data.npmClient === 'yarn' ? ['yarn', 'install'] : ['npm', 'install'];
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
    network: string;
  };

  export const questions: Questions<Data> = {
    type: 'select',
    name: 'network',
    message: 'Select a blockchain network:',
    // @ts-ignore
    hint: 'We recommend starting with a testnet.',
    choices: [
      { value: 'polygon-mumbai', message: 'Polygon (Mumbai Testnet)' },
      { value: 'polygon', message: 'Polygon (Mainnet)' },
      {
        value: 'ethereum-goerli',
        message: 'Ethereum (Goerli Testnet)',
      },
      { value: 'ethereum', message: 'Ethereum (Mainnet)' },
    ],
  };

  export const flags: Flags<Partial<Data>> = {
    network: {
      alias: 'n',
      type: String,
      description: 'The blockchain network to use',
    },
  };
}

export namespace AuthTypePrompt {
  const authMethods = [
    { name: 'Email OTP' },
    { name: 'SMS OTP', hint: '(Must toggle on at https://dashboard.magic.link)' },
    {
      name: 'Social Logins',
      hint: '(Must configure at https://dashboard.magic.link)',
      choices: ['Google', 'Github', 'Discord', 'Twitter', 'Twitch'],
    },
  ];

  export type Data = {
    selectedAuthTypes: string[];
  };

  export const questions: Questions<Data> = {
    type: 'multiselect',
    name: 'selectedAuthTypes',
    message:
      'How do you want your users to log in to their wallet? See Magic docs for help (https://magic.link/docs/auth/overview)',
    hint: '(<space> to select, <return> to submit)',
    choices: authMethods,
    validate: (value) => {
      if (!value.length) {
        return `Please use spacebar to select at least one login option.`;
      }

      return true;
    },
    // @ts-ignore
    result(names: string[]) {
      return names.filter((x: string) => !x.includes('Social Logins'));
    },
    format(value) {
      if (value) {
        return value.filter((x) => !x.includes('Social Logins')).join(', ');
      }

      return '';
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

        // value.forEach((i) => {
        //   if (!authMethods.includes(i)) invalid.push(i);
        // });

        if (invalid.length) {
          return `Received unknown auth method(s): (${invalid.join(', ')})`;
        }
      },
    },
  };
}
