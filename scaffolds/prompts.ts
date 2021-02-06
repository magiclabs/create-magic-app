/* eslint-disable @typescript-eslint/no-namespace */

import { Questions } from 'zombi';
import { ScaffoldFlags } from 'cli/utils/scaffold-helpers';
import { ValuesOf } from 'cli/types/utility-types';

export namespace PublicApiKeyPrompt {
  export type Data = {
    publicApiKey: 'npm' | 'yarn';
  };

  const validate = (value: string) =>
    value.startsWith('pk') ? true : '--public-api-key should look like `pk_live_...` or `pk_test_...`';

  export const questions: Questions<Data> = {
    type: 'input',
    name: 'publicApiKey',
    validate,
    message: 'Enter your Magic public API key:',
  };

  export const flags: ScaffoldFlags<Data> = {
    publicApiKey: {
      validate,
      description: 'The Magic public API key for your app.',
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

  export const flags: ScaffoldFlags<Data> = {
    npmClient: {
      validate: (value: string) => (clients.includes(value) ? true : `\`${value}\` is not a valid NPM client.`),
      description: 'The NPM client of your choice. (one of: npm, yarn)',
    },
  };

  export function getInstallCommand(data: Data) {
    return data.npmClient === 'npm' ? 'npm install' : 'yarn install';
  }

  export function getStartCommand(data: Data) {
    return data.npmClient === 'npm' ? 'npm start' : 'yarn start';
  }
}

export namespace SocialLoginsPrompt {
  export const providers = ['facebook', 'google', 'apple', 'linkedin', 'github', 'gitlab', 'bitbucket'];
  export type SocialLoginProvider = ValuesOf<typeof providers>;

  export type Data = {
    socialLogin: SocialLoginProvider[];
  };

  export const questions: Questions<Data> = {
    type: 'multiselect',
    name: 'socialLogin',
    message: 'Choose your social login providers:',
    choices: providers,
  };

  export const flags: ScaffoldFlags<Data> = {
    socialLogin: {
      description:
        'The social login provider your choice. You can provide this flag multiple times to select multiple providers. (one of:  facebook, google, apple, linkedin, github, gitlab, bitbucket)',
      isMultiple: true,
    },
  };
}
