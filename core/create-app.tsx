/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-param-reassign */

import fs from 'fs';
import { URL } from 'url';
import path from 'path';
import ora, { Ora } from 'ora';
import prettyTime from 'pretty-time';
import execa from 'execa';
import chalk from 'chalk';
import { BlockchainNetworkPrompt } from 'scaffolds/prompts';
import { downloadAndExtractRepo, getRepoInfo } from './utils/repo';
import { makeDir } from './utils/make-dir';
import { DEFAULT_CREATE_MAGIC_APP_REPO, GITHUB_BASE_URL } from './config';
import { getAbsoluteTemplatePath, getRelativeTemplatePath, resolveToDist, resolveToRoot } from './utils/path-helpers';
import { createProjectDirIfDoesntExists, getScaffoldDefinition } from './utils/scaffold-helpers';
import { printWarning } from './utils/errors-warnings';
import { parseFlags } from './flags';
import { addShutdownTask } from './utils/shutdown';
import { SharedAnalytics } from './analytics';
import { buildTemplate, mapTemplateToFlags, mapTemplateToScaffold } from './utils/templateMappings';
import { Timer, createTimer } from './utils/timer';
import BaseScaffold from './types/BaseScaffold';
import { renderScaffold } from './utils/renderScaffold';
import { ConsoleMessages } from './cli';

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

  const isChosenTemplateValid = availableScaffolds.map((i) => i.name).includes(config?.template!.toLowerCase());

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
      isQuickstart: false,
    })),
  };

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
  createProjectDirIfDoesntExists(cwd, config.projectName!);

  const templateData = {
    ...config,
    ...templateFlags,
    ...config.data,
  };

  console.log('templateData', templateData);

  const { gray, cyan } = chalk;
  const timer = createTimer();

  const spinner = ora({ text: 'Scaffolding', spinner: 'dots10' });
  startTimerAndSpinner(timer, spinner, false);

  const scaffold = await mapTemplateToScaffold(config.template as string, templateData, spinner, timer);

  startTimerAndSpinner(timer, spinner, true);
  console.log(`${gray('\n\nRunning scaffold ') + cyan.bold(scaffold.templateName)}\n`);

  await renderScaffold(process.cwd(), scaffold, templateData);

  const prettyTimeElapsed = prettyTime(timer.stop());
  spinner.succeed(gray(`Generated in ${cyan.bold(prettyTimeElapsed)}\n\n`));

  addShutdownTask(() => {
    console.log(ConsoleMessages.bootstrapSuccess(config.projectName!, path.join(destinationRoot, config.projectName!)));
  });

  const installCmd = await createPostRenderAction({
    data: templateData,
    cmd: 'installDependenciesCommand',
    scaffold,
    log: true,
  })?.wait();
  const startCmd = createPostRenderAction({ data: templateData, cmd: 'startCommand', scaffold, log: true });

  addShutdownTask(() => {
    console.log(ConsoleMessages.postRenderCommands(installCmd, startCmd, config.projectName!));
  });
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
    options.cmd === 'installDependenciesCommand' ? options.scaffold.installationCommand : options.scaffold.startCommand;

  if (getCmd) {
    const subprocess = execa(getCmd.command, getCmd.args, { stdio: 'inherit' });
    const bin = `${getCmd.command} ${getCmd.args.join(' ')}`;

    return Object.assign(bin, {
      wait: async () => {
        await subprocess;
        return bin;
      },
    });
  }
}

export function startTimerAndSpinner(timer: Timer, spinner: Ora, isPaused: boolean) {
  if (isPaused) {
    timer.resume();
  }
  timer.start();
  spinner.start();
}

export function pauseTimerAndSpinner(timer: Timer, spinner: Ora) {
  timer.pause();
  if (spinner.isSpinning) {
    spinner.stop();
  }
}
