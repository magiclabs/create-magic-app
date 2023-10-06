/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-param-reassign */

import fs from 'fs';
import { URL } from 'url';
import path from 'path';
import execa from 'execa';
import chalk from 'chalk';
import { downloadAndExtractRepo, getRepoInfo } from './utils/repo';
import { makeDir } from './utils/make-dir';
import { DEFAULT_CREATE_MAGIC_APP_REPO, GITHUB_BASE_URL } from './config';
import { getAbsoluteTemplatePath, getRelativeTemplatePath, resolveToDist, resolveToRoot } from './utils/path-helpers';
import { getScaffoldDefinition } from './utils/scaffold-helpers';
import { printWarning } from './utils/errors-warnings';
import { parseFlags } from './flags';
import { addShutdownTask } from './utils/shutdown';
import { SharedAnalytics } from './analytics';
import { buildTemplate, mapTemplateToFlags, mapTemplateToScaffold } from './utils/templateMappings';
import { BlockchainNetworkPrompt } from 'scaffolds/prompts';
import { copyFile, readTemplateDirs } from './utils/fs';
import ora from 'ora';
import { HrTime, createTimer } from './utils/timer';
import prettyTime from 'pretty-time';
import BaseScaffold from './types/BaseScaffold';
import { renderScaffold } from './utils/renderScaffold';

export interface CreateMagicAppData extends BlockchainNetworkPrompt.Data {
  /**
   * The `make-magic` project branch to source templates from.
   */
  branch: string;

  /**
   * The project name maps to a base directory
   * created to wrap the generated code.
   */
  projectName: string;

  /**
   * The base template to use for scaffolding your Magic-enabled application.
   */
  template: string;
}

export interface CreateMagicAppConfig extends Partial<CreateMagicAppData> {
  /**
   * Arbitrary data to passthrough to the template being scaffolded.
   * This data will be made available for any template-specific variables.
   */
  data?: {};
}

/**
 * Generates and runs a project scaffold.
 */
export async function createApp(config: CreateMagicAppConfig) {
  SharedAnalytics.logEvent('cli-tool-started', { input: config });

  const destinationRoot = process.cwd();

  const availableScaffolds = fs
    .readdirSync(resolveToDist('scaffolds'))
    .filter((name) => fs.statSync(resolveToDist('scaffolds', name)).isDirectory())
    .map((name) => {
      return {
        name,
        message: getScaffoldDefinition(name).shortDescription,
        featured: getScaffoldDefinition(name).featured,
      };
    });

  let isChosenTemplateValid = availableScaffolds.map((i) => i.name).includes(config?.template!);

  if (config?.template && !isChosenTemplateValid) {
    printWarning(chalk`'{bold ${config.template}}' does not match any templates.`);
    console.warn(); // Aesthetics!
  }

  config = {
    ...(await buildTemplate({
      ...config,
      chain: undefined,
      product: undefined,
      configuration: undefined,
      isChosenTemplateValid: false,
    })),
  };

  console.log('config', JSON.stringify(config, null, 2));

  const templateFlags: any = await parseFlags(mapTemplateToFlags(config.template as string), config?.data);
  const repoUrl = new URL(`${DEFAULT_CREATE_MAGIC_APP_REPO}/tree/${config.branch}`, GITHUB_BASE_URL);
  const repoInfo = await getRepoInfo(repoUrl, getRelativeTemplatePath(config.template as string));
  if (repoInfo) {
    const templatePath = getAbsoluteTemplatePath(config.template as string);

    // TODO - come back to this to check if out of date
    if (!fs.existsSync(templatePath)) {
      await makeDir(templatePath);
      await downloadAndExtractRepo(templatePath, repoInfo);
    }
  } else {
    // TODO: Handle case where repo info is not found
  }

  const cwd = process.cwd();
  if (!fs.existsSync(`${cwd}/${config.projectName}`)) {
    fs.mkdirSync(`${cwd}/${config.projectName}`);
  }
  process.chdir(config.projectName as string);

  const templateData = {
    ...config,
    ...templateFlags,
    ...config.data,
  };

  const { gray, yellow, cyan, red } = chalk;
  const timer = createTimer();
  let timeElapsed: HrTime;
  timer.start();

  const spinner = ora({ text: 'Scaffolding', spinner: 'dots10' });
  spinner.start();

  const scaffold = await mapTemplateToScaffold(config.template as string, templateData, spinner, timer);

  spinner.start();
  timer.resume();
  console.log(gray('\n\nRunning scaffold ') + cyan.bold(scaffold.templateName) + '\n');

  await renderScaffold(process.cwd(), scaffold, templateData);

  const prettyTimeElapsed = prettyTime(timer.stop());
  spinner.succeed(gray(`Generated in ${cyan.bold(prettyTimeElapsed)}\n\n`));

  addShutdownTask(() => {
    console.log(); // Aesthetics!

    const magic = chalk`{rgb(92,101,246) M}{rgb(127,103,246) ag}{rgb(168,140,248) ic}`;

    const msg = [
      '✨\n',
      chalk`{bold {green Success!} You've bootstrapped a ${magic} app with {rgb(0,255,255) ${config.projectName}}!}`,
      chalk`Created {bold.rgb(0,255,255) ${config.projectName}} at {bold.rgb(0,255,255) ${path.join(
        destinationRoot,
        config.projectName!,
      )}}`,
    ];

    console.log(msg.join('\n'));
  });

  const installCmd = await createPostRenderAction({
    data: templateData,
    cmd: 'installDependenciesCommand',
    scaffold,
    log: true,
  })?.wait();
  const startCmd = createPostRenderAction({ data: templateData, cmd: 'startCommand', scaffold, log: true });

  addShutdownTask(() => {
    console.log(); // Aesthetics!

    const separator = '';

    const msg = [
      (installCmd || startCmd) && chalk`Inside your app directory, you can run several commands:\n`,

      installCmd && chalk`  {rgb(0,255,255) ${installCmd}}`,
      installCmd && chalk`    Install dependencies.\n`,

      startCmd && chalk`  {rgb(0,255,255) ${startCmd}}`,
      startCmd && chalk`    Starts the app with a local development server.\n`,

      startCmd && chalk`Type the following to restart your newly-created app:\n`,
      startCmd && chalk`  {rgb(0,255,255) cd} ${config.projectName}`,
      startCmd && chalk`  {rgb(0,255,255) ${startCmd}}`,
    ].filter(Boolean);

    console.log(msg.join('\n'));
  });
}

function printPostShutdownInstructions(data: CreateMagicAppData & { destinationRoot: string } & Record<string, any>) {
  console.log(); // Aesthetics!

  const magic = chalk`{rgb(92,101,246) M}{rgb(127,103,246) ag}{rgb(168,140,248) ic}`;

  const msg = [
    chalk`{bold You've successfully bootstrapped a ${magic} app with {rgb(0,255,255) ${data.template}}!}`,
    chalk`Created {bold.rgb(0,255,255) ${data.projectName}} at {bold.rgb(0,255,255) ${path.join(
      data.destinationRoot,
      data.projectName,
    )}}`,
  ];

  console.log(msg.join('\n'));
}

/**
 * After the scaffold is rendered, we call this
 * function to invoke post-render shell commands.
 */
function createPostRenderAction(options: {
  data: CreateMagicAppData & Record<string, any>;
  cmd: 'installDependenciesCommand' | 'startCommand';
  scaffold: BaseScaffold;
  log?: boolean;
}) {
  const getCmd =
    options.cmd == 'installDependenciesCommand' ? options.scaffold.installationCommand : options.scaffold.startCommand;

  if (getCmd) {
    const subprocess = execa(getCmd.join(' '), undefined, { stdio: 'inherit' });
    const bin = getCmd.join(' ');

    return Object.assign(bin, {
      wait: async () => {
        console.log(process.cwd());
        console.log(fs.existsSync(path.join(process.cwd(), 'package.json')));
        console.log(subprocess);
        console.log(bin);
        await subprocess;
        return bin;
      },
    });
  }
}
