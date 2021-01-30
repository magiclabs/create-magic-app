/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-param-reassign */

import React from 'react';
import { Zombi, Directory, Template, scaffold } from 'zombi';
import path from 'path';
import fs from 'fs';
import { URL } from 'url';
import execa from 'execa';
import { downloadAndExtractRepo, getRepoInfo } from './utils/repo';
import { makeDir } from './utils/make-dir';
import { DEFAULT_CREATE_MAGIC_APP_REPO, GITHUB_BASE_URL } from './config';
import { getAbsoluteTemplatePath, getRelativeTemplatePath, resolveToDist } from './utils/path-helpers';
import { getScaffoldDefinition, getScaffoldRender } from './utils/scaffold-helpers';

export interface CreateMagicAppData {
  projectName: string;
  scaffoldName: string;
}

export async function createApp() {
  const destinationRoot = process.cwd();

  const template = (
    <Zombi<CreateMagicAppData>
      name="create-magic-app"
      templateRoot={false}
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
          name: 'scaffoldName',
          message: 'Choose a full-stack framework:',
          choices: fs.readdirSync(resolveToDist('scaffolds')).map((name) => {
            return { name, message: getScaffoldDefinition(name).shortDescription };
          }),
        },
      ]}
      onPromptResponse={async (data) => {
        const repoUrl = new URL(DEFAULT_CREATE_MAGIC_APP_REPO, GITHUB_BASE_URL);
        const repoInfo = await getRepoInfo(repoUrl, getRelativeTemplatePath(data.scaffoldName));

        if (repoInfo) {
          const templatePath = getAbsoluteTemplatePath(data.scaffoldName);

          if (!fs.existsSync(templatePath)) {
            await makeDir(templatePath);
            await downloadAndExtractRepo(templatePath, repoInfo);
          }
        } else {
          // TODO: Handle case where repo info is not found
        }
      }}
    >
      {(data) => {
        const renderTemplate = getScaffoldRender(data);
        return <Directory name={data.projectName}>{renderTemplate()}</Directory>;
      }}
    </Zombi>
  );

  const data = (await scaffold<CreateMagicAppData>(template)).data['create-magic-app'];

  console.log(); // Aesthetics!

  // Move the current working directory to the rendered scaffold.
  process.chdir(data.projectName);

  // Do post-render actions.
  await installDependencies(data);
  await runApp(data);
}

/**
 * After the scaffold is rendered, we call this function to install any
 * dependencies the example app requires.
 */
async function installDependencies(data: CreateMagicAppData) {
  // const installCommands: Record<string, string> = {
  //   'react-express': data.npmClient === 'npm' ? 'npm install' : 'yarn install',
  //   nextjs: data.npmClient === 'npm' ? 'npm install' : 'yarn install',
  // };
  //
  // const framework = Object.keys(installCommands).find((f) => data.framework === f)!;
  // const installCommand = installCommands[framework];
  //
  // if (installCommand) {
  //   await execa.command(installCommand, { stdio: 'inherit' });
  // }
}

/**
 * After the scaffold is rendered, we call this function to start the example
 * app, providing instant gratification for first-time Magic developers!
 */
async function runApp(data: CreateMagicAppData) {
  // const startCommands: Record<string, string> = {
  //   'react-express': data.npmClient === 'npm' ? 'npm run start' : 'yarn start',
  //   nextjs: data.npmClient === 'npm' ? 'npm run dev' : 'yarn dev',
  // };
  //
  // const framework = Object.keys(startCommands).find((f) => data.framework === f)!;
  // const startCommand = startCommands[framework];
  //
  // if (startCommand) {
  //   await execa.command(startCommand, { stdio: 'inherit' });
  // }
}
