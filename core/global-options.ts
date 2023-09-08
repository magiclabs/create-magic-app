import chalk from 'chalk';
import { BINARY } from './config';
import { CreateMagicAppData } from './create-app';
import { Flags } from './flags';
import {
  BlockchainNetworkPrompt,
  PublishableApiKeyPrompt,
  ProductPrompt,
  ConfigurationPrompt,
} from 'scaffolds/prompts';

export interface GlobalOptions extends Partial<CreateMagicAppData> {
  help?: boolean;
  version?: boolean;
  [key: string]: any;
}

export const globalOptions: Flags<GlobalOptions> = {
  projectName: {
    type: String,
    alias: 'p',
    description:
      'The name of your project. A top-level directory will be created from this value. If omitted, the project name will be prompted for interactively.',
  },

  template: {
    type: String,
    alias: 't',
    description: 'The base template to use. If omitted or invalid, the template will be prompted for interactively.',
  },

  branch: {
    type: String,
    alias: 'b',
    description: `The remote Git branch of \`${BINARY}\` from which to source templates.`,
    default: 'master',
  },

  help: {
    type: Boolean,
    alias: 'h',
    description: chalk`Show help (you're lookin' at it). {bold If --template or -t is provided, template-specific documentation will be printed, too.}`,
  },

  version: {
    type: Boolean,
    alias: 'v',
    description: `Show which version of \`${BINARY}\` is currently in use.`,
  },

  ...BlockchainNetworkPrompt.flags,
  ...PublishableApiKeyPrompt.flags,
  ...ProductPrompt.flags,
  ...ConfigurationPrompt.flags,
};
