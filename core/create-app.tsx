/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-param-reassign */

import fs from 'fs';
import { URL } from 'url';
import path, { parse } from 'path';
import React from 'react';
import { Zombi, Directory, scaffold } from 'zombi';
import execa from 'execa';
import chalk from 'chalk';
import { downloadAndExtractRepo, getRepoInfo } from './utils/repo';
import { makeDir } from './utils/make-dir';
import { DEFAULT_CREATE_MAGIC_APP_REPO, GITHUB_BASE_URL } from './config';
import { getAbsoluteTemplatePath, getRelativeTemplatePath, resolveToDist, resolveToRoot } from './utils/path-helpers';
import { getScaffoldDefinition, getScaffoldRender } from './utils/scaffold-helpers';
import { filterNilValues } from './utils/filter-nil-values';
import { printWarning } from './utils/errors-warnings';
import { parseFlags } from './flags';
import { addShutdownTask } from './utils/shutdown';
import { SharedAnalytics } from './analytics';
import {
  Chain,
  mapTemplateToChain,
  mapTemplateToFlags,
  mapTemplateToProduct,
  mapTemplateToScaffold,
} from './utils/templateMappings';
import { BlockchainNetworkPrompt } from 'scaffolds/prompts';
import { copyFile, readTemplateDirs } from './utils/fs';
import ora from 'ora';
import { HrTime, createTimer } from './utils/timer';
import prettyTime from 'pretty-time';
import BaseScaffold from './types/BaseScaffold';

const { Select, Input, MultiSelect } = require('enquirer');

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

  const isProgrammaticFlow = !!config.data;
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

  if (!config.projectName) {
    const projectName = await new Input({
      name: 'projectName',
      message: 'What is your project named?',
      initial: 'awesome-magic-app',
    }).run();

    config.projectName = projectName;
  }

  let chain: Chain | undefined = undefined;
  let product: 'universal' | 'dedicated' | undefined = undefined;
  let configuration = '';
  if (!config.template) {
    configuration = await new Select({
      name: 'configuration',
      message: 'Select a configuration to start with:',
      choices: [
        { name: 'quickstart', message: 'Quickstart (Nextjs, Dedicated Wallet, Polygon Testnet, Email OTP)' },
        { name: 'custom', message: 'Custom Setup (Choose product, network, etc.)' },
      ],
    }).run();

    if (configuration === 'quickstart') {
      config.template = 'nextjs-dedicated-wallet';
      config.network = 'polygon-mumbai';
      product = 'dedicated';
      chain = 'evm';
      isChosenTemplateValid = true;
    }
  } else {
    chain = mapTemplateToChain(config.template);
    product = mapTemplateToProduct(config.template);
  }

  if (!chain && !config.network) {
    chain = await BlockchainNetworkPrompt.chainPrompt();
  }

  if (!config.network) {
    if (chain === 'solana') {
      config.network = await BlockchainNetworkPrompt.solanaNetworkPrompt();

      product = 'dedicated';
      config.template = 'nextjs-solana-dedicated-wallet';
      isChosenTemplateValid = true;
    } else if (chain === 'flow') {
      config.network = await BlockchainNetworkPrompt.flowNetworkPrompt();
    } else if (chain === 'evm') {
      config.network = await BlockchainNetworkPrompt.evmNetworkPrompt();
    }
  } else {
    if (
      config.network == 'ethereum' ||
      config.network == 'ethereum-goerli' ||
      config.network == 'polygon' ||
      config.network == 'polygon-mumbai'
    ) {
      chain = 'evm';
    } else if (config.network == 'solana-denvet' || config.network == 'solana-mainnet') {
      chain = 'solana';
    } else {
      chain = 'flow';
    }
  }

  if (!product) {
    product = await new Select({
      name: 'product',
      message: 'Choose your wallet type',
      choices: [
        { name: 'universal', message: 'Universal' },
        { name: 'dedicated', message: 'Dedicated' },
      ],
    }).run();

    if (product === 'universal') {
      if (chain === 'flow') {
        config.template = 'nextjs-flow-universal-wallet';
      } else {
        config.template = 'nextjs-universal-wallet';
      }
    } else if (chain === 'flow') {
      config.template = 'nextjs-flow-dedicated-wallet';
    } else {
      config.template = 'nextjs-dedicated-wallet';
    }
    isChosenTemplateValid = true;
  }

  // const template = (
  //   <Zombi<CreateMagicAppData>
  //     name="create-magic-app"
  //     templateRoot={false}
  //     destinationRoot={destinationRoot}
  //     data={filterNilValues({
  //       branch: config?.branch ?? 'master',
  //       projectName: config?.projectName,
  //       template: isChosenTemplateValid ? config.template : undefined,
  //       network: config.network,
  //       npmClient: 'npm',
  //       loginMethods: configuration === 'quickstart' ? ['EmailOTP'] : undefined,
  //     })}
  //     prompts={[
  //       {
  //         type: 'input',
  //         name: 'projectName',
  //         message: 'What is your project named?',
  //         initial: 'awesome-magic-app',
  //       },
  //     ]}
  //   >
  //     {async (data) => {
  //       const repoUrl = new URL(`${DEFAULT_CREATE_MAGIC_APP_REPO}/tree/${data.branch}`, GITHUB_BASE_URL);
  //       const repoInfo = await getRepoInfo(repoUrl, getRelativeTemplatePath(data.template));

  //       if (repoInfo) {
  //         const templatePath = getAbsoluteTemplatePath(data.template);

  //         if (!fs.existsSync(templatePath)) {
  //           await makeDir(templatePath);
  //           await downloadAndExtractRepo(templatePath, repoInfo);
  //         }
  //       } else {
  //         // TODO: Handle case where repo info is not found
  //       }

  //       const templateData = await parseFlags(getScaffoldDefinition(data.template).flags, config?.data);
  //       const renderTemplate = getScaffoldRender(filterNilValues({ ...config, ...templateData, ...data }));
  //       return <Directory name={data.projectName}>{renderTemplate()}</Directory>;
  //     }}
  //   </Zombi>
  // );
  // const scaffoldResult = await scaffold<{ 'create-magic-app': CreateMagicAppData; [key: string]: any }>(template);
  // const { projectName: chosenProjectName, template: chosenTemplate } = scaffoldResult.data['create-magic-app'];

  // SharedAnalytics.logEvent('cli-tool-scaffold-cloned', { data: scaffoldResult.data });

  // console.log(); // Aesthetics!

  // // Save the current working directory and
  // // change directories into the rendered scaffold.
  // const cwd = process.cwd();
  // process.chdir(chosenProjectName);

  // if (fs.existsSync(`${cwd}/${chosenProjectName}/.env.example`)) {
  //   fs.renameSync(`${cwd}/${chosenProjectName}/.env.example`, `${cwd}/${chosenProjectName}/.env`);
  // }

  // // Do post-render actions...
  // const data = {
  //   ...scaffoldResult.data['create-magic-app'],
  //   ...scaffoldResult.data[chosenTemplate],
  // };

  // if (isProgrammaticFlow) {
  //   await createPostRenderAction({ data, cmd: 'installDependenciesCommand' })?.wait();
  // } else {
  //   addShutdownTask(() => {
  //     console.log(); // Aesthetics!

  //     const magic = chalk`{rgb(92,101,246) M}{rgb(127,103,246) ag}{rgb(168,140,248) ic}`;

  //     const msg = [
  //       '✨\n',
  //       chalk`{bold {green Success!} You've bootstrapped a ${magic} app with {rgb(0,255,255) ${chosenTemplate}}!}`,
  //       chalk`Created {bold.rgb(0,255,255) ${chosenProjectName}} at {bold.rgb(0,255,255) ${path.join(
  //         destinationRoot,
  //         chosenProjectName,
  //       )}}`,
  //     ];

  //     console.log(msg.join('\n'));
  //   });

  //   const installCmd = await createPostRenderAction({ data, cmd: 'installDependenciesCommand', log: true })?.wait();
  //   const startCmd = createPostRenderAction({ data, cmd: 'startCommand', log: true });

  //   addShutdownTask(() => {
  //     console.log(); // Aesthetics!

  //     const separator = '';

  //     const msg = [
  //       (installCmd || startCmd) && chalk`Inside your app directory, you can run several commands:\n`,

  //       installCmd && chalk`  {rgb(0,255,255) ${installCmd}}`,
  //       installCmd && chalk`    Install dependencies.\n`,

  //       startCmd && chalk`  {rgb(0,255,255) ${startCmd}}`,
  //       startCmd && chalk`    Starts the app with a local development server.\n`,

  //       startCmd && chalk`Type the following to restart your newly-created app:\n`,
  //       startCmd && chalk`  {rgb(0,255,255) cd} ${chosenProjectName}`,
  //       startCmd && chalk`  {rgb(0,255,255) ${startCmd}}`,
  //     ].filter(Boolean);

  //     console.log(msg.join('\n'));
  //   });

  //   SharedAnalytics.logEvent('cli-tool-completed', {});
  // }

  // // Return to the previous working directory
  // // before "post-render actions" executed.
  // process.chdir(cwd);

  // return scaffoldResult;

  const templateFlags: any = await parseFlags(mapTemplateToFlags(config.template as string), config?.data);
  const repoUrl = new URL(`${DEFAULT_CREATE_MAGIC_APP_REPO}/tree/${config.branch}`, GITHUB_BASE_URL);
  const repoInfo = await getRepoInfo(repoUrl, getRelativeTemplatePath(config.template as string));
  if (repoInfo) {
    const templatePath = getAbsoluteTemplatePath(config.template as string);

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

  const basePath = `${resolveToRoot('scaffolds', scaffold.templateName)}\\template`;
  const allDirFilePaths = [];
  if (typeof scaffold.source == 'string') {
    readTemplateDirs(basePath, (err, filePaths) => {
      if (err) {
        console.log(err);
      }
      for (const filePath of filePaths) {
        allDirFilePaths.push(filePath);
      }
    });
  } else {
    for (const filePath of scaffold.source) {
      const resolvedPath = resolveToRoot('scaffolds', `${scaffold.templateName}/template/${filePath}`);

      const isDirectory = fs.statSync(resolvedPath).isDirectory();
      if (isDirectory) {
        readTemplateDirs(resolvedPath, (err, filePaths) => {
          if (err) {
            console.log(err);
          }
          for (const filePath of filePaths) {
            allDirFilePaths.push(filePath);
          }
        });
      } else {
        allDirFilePaths.push(resolvedPath);
      }
    }
    for (const filePath of allDirFilePaths) {
      await copyFile(filePath, `${process.cwd()}/${filePath.replace(basePath, '')}`, templateData);
    }
  }

  if (fs.existsSync(`${process.cwd()}\\.env.example`)) {
    fs.renameSync(`${process.cwd()}\\.env.example`, `${process.cwd()}\\.env`);
  }
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
        await subprocess;
        return bin;
      },
    });
  }
}
