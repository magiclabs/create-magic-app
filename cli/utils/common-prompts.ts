/* eslint-disable @typescript-eslint/no-namespace */

import { Questions } from 'zombi';
import { ScaffoldFlags } from './scaffold-helpers';

export namespace PublicApiKeyPrompt {
  export type Data = {
    publicApiKey: 'npm' | 'yarn';
  };

  export const questions: Questions<Data> = {
    type: 'input',
    name: 'publicApiKey',
    message: 'Enter your Magic public API key:',
  };

  export const flags: ScaffoldFlags<Data> = {
    publicApiKey: 'The Magic public API key for your app.',
  };
}

export namespace NpmClientPrompt {
  export type Data = {
    npmClient: 'npm' | 'yarn';
  };

  export const questions: Questions<Data> = {
    type: 'select',
    name: 'npmClient',
    message: 'Choose an NPM client:',
    choices: ['npm', 'yarn'],
  };

  export const flags: ScaffoldFlags<Data> = {
    npmClient: 'The NPM client of your choice. (one of: npm, yarn)',
  };

  export function getInstallCommand(data: Data) {
    return data.npmClient === 'npm' ? 'npm install' : 'yarn install';
  }

  export function getStartCommand(data: Data) {
    return data.npmClient === 'npm' ? 'npm start' : 'yarn start';
  }
}

export namespace SocialLoginsPrompt {
  export type SocialLoginProvider = 'facebook' | 'google' | 'github' | 'linkedin';

  export type Data = {
    socialLogins: SocialLoginProvider[];
  };

  export const questions: Questions<Data> = {
    type: 'multiselect',
    name: 'socialLogins',
    message: 'Choose your social login providers:',
    choices: ['facebook', 'google', 'github', 'linkedin'],
  };

  export const flags: ScaffoldFlags<Data> = {
    socialLogins: {
      description:
        'The social login provider your choice. You can provide this flag multiple times to select multiple providers. (one of: facebook, google, github, linkedin)',
      isMultiple: true,
    },
  };
}
