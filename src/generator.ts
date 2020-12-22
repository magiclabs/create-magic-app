/* eslint-disable no-param-reassign */

import { copy, sideEffect, yarnInstall, zombi } from 'zombi';
import { resolve } from 'path';

interface Props {
  projectName: string;
  framework: string;
  database: string;
  socialLogins: string[];
  magicPublishableKey: string;
  magicSecretKey: string;
  faunaSecretKey?: string;
  startCommand?: string;
}

const generator = zombi<Props>({
  name: 'create-magic-app',
  templateRoot: resolve(__dirname, '..', 'templates'),
});

export default generator
  .prompt([
    {
      name: 'projectName',
      message: 'What is your project named?',
      type: 'Input',
      initial: 'my-app',
    },

    {
      name: 'framework',
      message: 'Choose a full-stack framework:',
      type: 'Select',
      choices: [
        { name: 'react-express', message: 'React + Express' },
        { name: 'nextjs', message: 'NextJS' },
      ],
    },

    {
      name: 'database',
      message: 'Choose a database:',
      type: 'Select',
      choices: [
        { name: 'none', message: 'None' },
        { name: 'fauna', message: 'FaunaDB' },
      ],
    },

    {
      name: 'socialLogins',
      message: 'Choose social login providers:',
      type: 'MultiSelect',
      choices: [
        { name: 'google', message: 'Sign in with Google' },
        { name: 'facebook', message: 'Sign in with Facebook' },
        { name: 'github', message: 'Sign in with GitHub' },
      ],
    },
  ])
  .prompt(({ props }) => [
    {
      name: 'magicPublishableKey',
      message: `Paste your Magic public API key:`,
      type: 'Input',
    },

    {
      name: 'magicSecretKey',
      message: `Paste your Magic secret API key:`,
      type: 'Password',
    },

    props.database.includes('fauna') && {
      name: 'faunaSecretKey',
      message: `Paste your FaunaDB secret:`,
      type: 'Password',
    },
  ])
  .sequence(
    copy(
      ({ props }) =>
        [
          props.framework,
          props.database !== 'none' && props.database,
          props.socialLogins.length ? 'withsocial' : 'emailonly',
        ]
          .filter(Boolean)
          .join('-'),
      ({ props }) => `./${props.projectName}`,
    ),

    sideEffect(({ props }) => {
      process.chdir(props.projectName);
    }),

    sideEffect(({ props }) => {
      const startCommands: Record<string, string> = {
        'react-express': 'yarn start',
        nextjs: 'yarn dev',
      };

      const framework = Object.keys(startCommands).find((f) => props.framework === f);
      if (framework) props.startCommand = startCommands[framework];
    }),

    yarnInstall(),
  );
