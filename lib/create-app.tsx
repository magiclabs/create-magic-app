/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-param-reassign */

import React from 'react';
import { Zombi, Directory, scaffold } from 'zombi';
import fs from 'fs';
import { URL } from 'url';
import execa from 'compiled/execa';
import chalk from 'compiled/chalk';
import { downloadAndExtractRepo, getRepoInfo } from './utils/repo';
import { makeDir } from './utils/make-dir';
import { DEFAULT_CREATE_MAGIC_APP_REPO, GITHUB_BASE_URL } from './config';
import { getAbsoluteTemplatePath, getRelativeTemplatePath, resolveToDist } from './utils/path-helpers';
import { getScaffoldDefinition, getScaffoldRender } from './utils/scaffold-helpers';
import { filterNilValues } from './utils/filter-nil-values';

export interface CreateMagicAppData {
  branch: string;
  projectName: string;
  template: string;
}

export async function createApp(initialData: Partial<CreateMagicAppData> & Record<string, any>) {
  const destinationRoot = process.cwd();

  const availableScaffolds = fs.readdirSync(resolveToDist('scaffolds')).map((name) => {
    return { name, message: getScaffoldDefinition(name).shortDescription };
  });

  const isChosenTemplateValid = availableScaffolds.map((i) => i.name).includes(initialData?.template as any);

  if (initialData?.template && !isChosenTemplateValid) {
    console.warn(`${chalk.yellow('Warning:')} '${chalk.bold(initialData.template)}' does not match any templates.`);
    console.warn(); // Aesthetics!
  }

  const template = (
    <Zombi<CreateMagicAppData>
      name="create-magic-app"
      templateRoot={false}
      destinationRoot={destinationRoot}
      data={filterNilValues({
        branch: initialData?.branch ?? 'master',
        projectName: initialData?.projectName,
        template: isChosenTemplateValid ? initialData?.template : undefined,
      })}
      prompts={[
        {
          type: 'input',
          name: 'projectName',
          message: 'What is your project named?',
          initial: 'my-app',
        },

        !isChosenTemplateValid && {
          type: 'select',
          name: 'template',
          message: 'Choose a template:',
          choices: availableScaffolds,
        },
      ]}
      onPromptResponse={async (data) => {
        const repoUrl = new URL(`${DEFAULT_CREATE_MAGIC_APP_REPO}/tree/${data.branch}`, GITHUB_BASE_URL);
        const repoInfo = await getRepoInfo(repoUrl, getRelativeTemplatePath(data.template));

        if (repoInfo) {
          const templatePath = getAbsoluteTemplatePath(data.template);

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
        const renderTemplate = getScaffoldRender(filterNilValues({ ...initialData, ...data }));
        return <Directory name={data.projectName}>{renderTemplate()}</Directory>;
      }}
    </Zombi>
  );

  const data = (await scaffold<{ 'create-magic-app': CreateMagicAppData }>(template)).data['create-magic-app'];

  console.log(); // Aesthetics!

  // Move the current working directory to the rendered scaffold.
  process.chdir(data.projectName);

  // Do post-render actions.
  await executePostRenderAction(data, 'installDependenciesCommand');
  await executePostRenderAction(data, 'startCommand');
}

/**
 * After the scaffold is rendered, we call this
 * function to invoke post-render shell commands.
 */
async function executePostRenderAction(
  data: CreateMagicAppData,
  cmdType: 'installDependenciesCommand' | 'startCommand',
) {
  const cmd = getScaffoldDefinition(data.template)[cmdType];

  if (cmd) {
    await execa.command(cmd, { stdio: 'inherit' });
  }
}
