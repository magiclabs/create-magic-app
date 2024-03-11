/* eslint-disable @typescript-eslint/ban-ts-comment */

import type { Flags } from 'core/flags';
import type { ValuesOf } from 'core/types/utility-types';
import { ExecaCommand } from 'core/types/BaseScaffold';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Select, MultiSelect, Input } = require('enquirer');

export namespace ProjectNamePrompt {
  export type Data = {
    projectName: string;
  };

  export const askProjectName = async () =>
    new Input({
      name: 'projectName',
      message: 'What is your project named?',
      initial: 'awesome-magic-app',
    }).run();

  export const flags: Flags<Partial<Data>> = {
    projectName: {
      type: String,
      description: 'The name of your project.',
    },
  };
}

export namespace ConfigurationPrompt {
  export type Data = {
    configuration: string;
  };

  export const askConfiguration = async () =>
    new Select({
      name: 'configuration',
      message: 'Select a configuration to start with:',
      choices: [
        { name: 'quickstart', message: 'Quickstart (Nextjs, Dedicated Wallet, Polygon Testnet, Email OTP)' },
        { name: 'custom', message: 'Custom Setup (Choose product, network, etc.)' },
      ],
    }).run();

  export const flags: Flags<Partial<Data>> = {
    configuration: {
      type: String,
      description: 'The configuration type of your project.',
    },
  };
}

export namespace ProductPrompt {
  export type Data = {
    product: string;
  };

  export const askProduct = async () =>
    new Select({
      name: 'product',
      message: 'Choose your wallet type',
      choices: [
        { name: 'universal', message: 'Universal' },
        { name: 'dedicated', message: 'Dedicated' },
      ],
    }).run();

  export const flags: Flags<Partial<Data>> = {
    product: {
      type: String,
      description: 'The product type of your project.',
    },
  };
}

export namespace PublishableApiKeyPrompt {
  export type Data = {
    publishableApiKey: string;
  };

  const validate = (value: string) =>
    value === '' || value.startsWith('pk')
      ? true
      : '--publishable-api-key should look like `pk_live_...` or `pk_test_...`';

  export const publishableApiKeyPrompt = async () =>
    new Input({
      message: 'Enter Magic publishable API key from https://dashboard.magic.link:',
      // @ts-ignore
      hint: '(leave blank to skip for now)',
      validate,
    }).run();

  export const flags: Flags<Partial<Data>> = {
    publishableApiKey: {
      type: String,
      description: 'The Magic publishable API key for your app.',
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

  export function getStartCommand(packageJsonScript: string): ExecaCommand | ((data: Data) => ExecaCommand) {
    return (data: Data) => {
      return data.npmClient === 'npm'
        ? { command: 'npm', args: ['run', packageJsonScript] }
        : { command: 'yarn', args: [packageJsonScript] };
    };
  }
}

export namespace BlockchainNetworkPrompt {
  export type Data = {
    network: string;
  };

  export const chainPrompt = async () =>
    new Select({
      name: 'chain',
      message: 'Which blockchain do you want to use?',
      choices: [
        { name: 'evm', message: 'EVM (Ethereum, Polygon, etc.)' },
        { name: 'solana', message: 'Solana' },
        { name: 'flow', message: 'Flow' },
      ],
    }).run();

  export const solanaNetworkPrompt = async () =>
    new Select({
      name: 'network',
      message: 'Which network would you like to use?',
      hint: 'We recommend starting with a test network',
      choices: [
        { name: 'solana-mainnet', message: 'Mainnet' },
        { name: 'solana-devnet', message: 'Devnet' },
      ],
    }).run();

  export const flowNetworkPrompt = async () =>
    new Select({
      name: 'network',
      message: 'Which network would you like to use?',
      hint: 'We recommend starting with a test network',
      choices: [
        { name: 'flow-mainnet', message: 'Mainnet' },
        { name: 'flow-testnet', message: 'Testnet' },
      ],
    }).run();

  export const evmNetworkPrompt = async () =>
    new Select({
      name: 'network',
      message: 'Which network would like to use?',
      hint: 'We recommend starting with a test network',
      choices: [
        { name: 'ethereum', message: 'Ethereum (Mainnet)' },
        { name: 'ethereum-sepolia', message: 'Ethereum (Sepolia Testnet)' },
        { name: 'polygon', message: 'Polygon (Mainnet)' },
        { name: 'polygon-amoy', message: 'Polygon (Amoy Testnet)' },
        { name: 'zksync', message: 'zkSync (Mainnet)' },
        { name: 'zksync-sepolia', message: 'zkSync (Sepolia Testnet)' },
      ],
    }).run();

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
    loginMethods: string[];
  };

  export const loginMethodsPrompt = async () =>
    new MultiSelect({
      message:
        'How do you want your users to log in to their wallet? See Magic docs for help (https://magic.link/docs/auth/overview)',
      hint: '(<space> to select, <return> to submit)',
      choices: authMethods,
      validate: (value: string | any[]) => {
        if (!value.length) {
          return `Please use spacebar to select at least one login option.`;
        }

        return true;
      },
      result(names: string[]) {
        return names.filter((x: string) => !x.includes('Social Logins'));
      },
    }).run();

  export const flags: Flags<Partial<Data>> = {
    loginMethods: {
      type: [String],
      description: `The auth method(s) of your choice. You can provide this flag multiple times to select multiple methods. (one of: ${authMethods
        .map((method) => (method.choices ? method.choices.map((choice) => choice).join(', ') : method.name))
        .join(', ')})`,
      validate: (value) => {
        const invalid: string[] = [];

        if (invalid.length) {
          return `Received unknown auth method(s): (${invalid.join(', ')})`;
        }
      },
    },
  };

  export const mapInputToLoginMethods = (input: string) => {
    if (input.replaceAll(' ', '').toLocaleLowerCase().includes('emailotp')) {
      return 'EmailOTP';
    }

    if (input.replaceAll(' ', '').toLocaleLowerCase().includes('smsotp')) {
      return 'SMSOTP';
    }

    if (input.replaceAll(' ', '').toLocaleLowerCase().includes('google')) {
      return 'Google';
    }

    if (input.replaceAll(' ', '').toLocaleLowerCase().includes('github')) {
      return 'Github';
    }

    if (input.replaceAll(' ', '').toLocaleLowerCase().includes('discord')) {
      return 'Discord';
    }

    if (input.replaceAll(' ', '').toLocaleLowerCase().includes('twitter')) {
      return 'Twitter';
    }

    if (input.replaceAll(' ', '').toLocaleLowerCase().includes('twitch')) {
      return 'Twitch';
    }

    return input;
  };
}
