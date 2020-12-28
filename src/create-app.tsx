/* eslint-disable no-param-reassign */

import React from 'react';
import { Zombi, Directory, Template, scaffold } from 'zombi';
import path from 'path';
import fs from 'fs';
import { URL } from 'url';
import execa from 'execa';
import { downloadAndExtractRepo, getRepoInfo } from './utils/repo';
import { makeDir } from './utils/make-dir';
import { DEFAULT_CREATE_MAGIC_APP_REPO, GITHUB_BASE_URL, TEMPLATE_ROOT } from './config';

interface TemplateData {
  projectName: string;
  framework: string;
  database: string;
  socialLogins: string[];
  magicPublishableKey: string;
  magicSecretKey: string;
  faunaSecretKey?: string;
  npmClient: 'npm' | 'yarn';
}

export async function createApp() {
  const destinationRoot = process.cwd();

  const template = (
    <Zombi<TemplateData>
      name="create-magic-app"
      templateRoot={TEMPLATE_ROOT}
      destinationRoot={destinationRoot}
      prompts={[
        {
          type: 'input',
          name: 'projectName',
          message: 'What is your project named?',
          initial: 'my-app',
        },

        {
          type: 'select',
          name: 'framework',
          message: 'Choose a full-stack framework:',
          choices: [
            { name: 'react-express', message: 'React + Express' },
            { name: 'nextjs', message: 'NextJS' },
          ],
        },

        {
          type: 'select',
          name: 'database',
          message: 'Choose a database:',
          choices: [
            { name: 'none', message: 'None' },
            { name: 'fauna', message: 'FaunaDB' },
          ],
        },

        {
          type: 'multiselect',
          name: 'socialLogins',
          message: 'Choose social login providers:',
          choices: [
            { name: 'google', message: 'Sign in with Google' },
            { name: 'facebook', message: 'Sign in with Facebook' },
            { name: 'github', message: 'Sign in with GitHub' },
          ],
        },

        {
          type: 'input',
          name: 'magicPublishableKey',
          message: `Paste your Magic public API key:`,
        },

        {
          type: 'password',
          name: 'magicSecretKey',
          message: `Paste your Magic secret API key:`,
        },

        (data) => [
          data.database.includes('fauna') && {
            type: 'password',
            name: 'faunaSecretKey',
            message: `Paste your FaunaDB secret:`,
          },
        ],

        {
          type: 'select',
          name: 'npmClient',
          message: 'Which NPM client would you like to use?',
          choices: [
            { name: 'npm', message: 'NPM' },
            { name: 'yarn', message: 'Yarn' },
          ],
        },
      ]}
      onPromptResponse={async (data) => {
        const example = getExamplePath(data);
        const repoUrl = new URL(DEFAULT_CREATE_MAGIC_APP_REPO, GITHUB_BASE_URL);
        const repoInfo = await getRepoInfo(repoUrl, path.join('templates', example));

        if (repoInfo) {
          const root = path.resolve(TEMPLATE_ROOT, example);

          if (!fs.existsSync(root)) {
            await makeDir(root);
            await downloadAndExtractRepo(root, repoInfo);
          }
        } else {
          // TODO: Handle case where repo info is not found
        }
      }}
    >
      {(data) => (
        <Directory name={data.projectName}>
          <Template source={getExamplePath(data)} name="." />
        </Directory>
      )}
    </Zombi>
  );

  const { data: globalData } = await scaffold<TemplateData>(template);
  const { 'create-magic-app': data } = globalData;

  console.log(); // Aesthetics!

  // Move the current working directory to the rendered scaffold.
  process.chdir(data.projectName);

  // Do post-render actions.
  await installDependencies(data);
  await runApp(data);
}

/**
 * Resolve a path to the target template.
 */
function getExamplePath(data: Partial<TemplateData>) {
  return [
    data.framework,
    data.database !== 'none' && data.database,
    data.socialLogins?.length ? 'withsocial' : 'emailonly',
  ]
    .filter(Boolean)
    .join('-');
}

/**
 * After the scaffold is rendered, we call this function to install any
 * dependencies the example app requires.
 */
async function installDependencies(data: TemplateData) {
  const installCommands: Record<string, string> = {
    'react-express': data.npmClient === 'npm' ? 'npm install' : 'yarn install',
    nextjs: data.npmClient === 'npm' ? 'npm install' : 'yarn install',
  };

  const framework = Object.keys(installCommands).find((f) => data.framework === f)!;
  const installCommand = installCommands[framework];

  if (installCommand) {
    await execa.command(installCommand, { stdio: 'inherit' });
  }
}

/**
 * After the scaffold is rendered, we call this function to start the example
 * app, providing instant gratification for first-time Magic developers!
 */
async function runApp(data: TemplateData) {
  const startCommands: Record<string, string> = {
    'react-express': data.npmClient === 'npm' ? 'npm run start' : 'yarn start',
    nextjs: data.npmClient === 'npm' ? 'npm run dev' : 'yarn dev',
  };

  const framework = Object.keys(startCommands).find((f) => data.framework === f)!;
  const startCommand = startCommands[framework];

  if (startCommand) {
    await execa.command(startCommand, { stdio: 'inherit' });
  }
}
