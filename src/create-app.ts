/* eslint-disable no-param-reassign */

import { copy, sideEffect, yarnInstall, zombi } from 'zombi';
import path from 'path';
import fs from 'fs';
import { URL } from 'url';
import { downloadAndExtractRepo, getRepoInfo, hasRepo } from './utils/repo';
import { makeDir } from './utils/make-dir';
import { DEFAULT_CREATE_MAGIC_APP_REPO, GITHUB_BASE_URL, TEMPLATE_ROOT } from './config';

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

function getExamplePath(props: Props) {
  return [
    props.framework,
    props.database !== 'none' && props.database,
    props.socialLogins.length ? 'withsocial' : 'emailonly',
  ]
    .filter(Boolean)
    .join('-');
}

export async function createApp() {
  const generator = zombi<Props>({
    name: 'create-magic-app',
    templateRoot: TEMPLATE_ROOT,
  });

  return generator
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
      sideEffect(async ({ props, context }, utils) => {
        const example = getExamplePath(props);
        const repoUrl = new URL(DEFAULT_CREATE_MAGIC_APP_REPO, GITHUB_BASE_URL);
        const repoInfo = await getRepoInfo(repoUrl, path.join('templates', example));

        if (repoInfo) {
          const found = await hasRepo(repoInfo);

          if (found) {
            const root = context.template(example);

            if (!fs.existsSync(root)) {
              utils.statusIO.write('Pulling templates...');
              await makeDir(root);
              await downloadAndExtractRepo(root, repoInfo);
            }
          } else {
            // TODO: Handle case where repo is not found
          }
        } else {
          // TODO: Handle case where repo info is not found
        }
      }),

      copy(
        ({ props }) => getExamplePath(props),
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
    )
    .run();
}
