import fs from 'fs';
import chalk from 'chalk';
import { createApp } from './create-app';
import { printHelp } from './help-text';
import { resolveToRoot } from './utils/path-helpers';
import { CreateMagicAppError, CreateMagicAppErrorCode } from './utils/errors-warnings';
import { parseFlags } from './flags';
import { globalOptions } from './global-options';
import { shutdown, useGracefulShutdown } from './utils/shutdown';
import { SharedAnalytics } from './analytics';
import { modifyUsageConsent, initializeUsageConfigIfneeded } from './utils/usagePermissions';
import { loadConfig } from './config';
import suppressWarnings from './utils/suppress-experimental-warnings';

export const ConsoleMessages = {
  bootstrapSuccess: (projectName: string, destination: string) => {
    console.log(); // Aesthetics!

    const magic = chalk`{rgb(92,101,246) M}{rgb(127,103,246) ag}{rgb(168,140,248) ic}`;

    const msg = [
      '✨\n',
      chalk`{bold {green Success!} You've bootstrapped a ${magic} app with {rgb(0,255,255) ${projectName}}!}`,
      chalk`Created {bold.rgb(0,255,255) ${projectName}} at {bold.rgb(0,255,255) ${destination}}`,
    ];

    return msg.join('\n');
  },

  postRenderCommands: (installCmd: string | undefined, startCmd: string | undefined, projectName: string) => {
    console.log(); // Aesthetics!

    const msg = [
      (installCmd || startCmd) && chalk`Inside your app directory, you can run several commands:\n`,

      installCmd && chalk`  {rgb(0,255,255) ${installCmd}}`,
      installCmd && chalk`    Install dependencies.\n`,

      startCmd && chalk`  {rgb(0,255,255) ${startCmd}}`,
      startCmd && chalk`    Starts the app with a local development server.\n`,

      startCmd && chalk`Type the following to restart your newly-created app:\n`,
      startCmd && chalk`  {rgb(0,255,255) cd} ${projectName}`,
      startCmd && chalk`  {rgb(0,255,255) ${startCmd}}`,
    ].filter(Boolean);

    msg.join('\n');
  },
};

function sayHello() {
  console.log(chalk`\n
 {rgb(92,101,246) █▀▀ █}{rgb(127,103,246) ▀█ █▀▀} {rgb(133,139,247) ▄▀█ ▀█▀} {rgb(168,140,248) █▀▀}
 {rgb(92,101,246) █▄▄ █}{rgb(127,103,246) ▀▄ ██▄} {rgb(133,139,247) █▀█  █ } {rgb(168,140,248) ██▄}

 {rgb(92,101,246) █▀▄▀█} {rgb(127,103,246) ▄▀█ █▀}{rgb(133,139,247) ▀ █ █▀▀}
 {rgb(92,101,246) █ ▀ █} {rgb(127,103,246) █▀█ █▄}{rgb(133,139,247) █ █ █▄▄}

 {rgb(92,101,246) ▄▀█ █}{rgb(127,103,246) ▀█ █▀█}
 {rgb(92,101,246) █▀█ █}{rgb(127,103,246) ▀▀ █▀▀}
`);

  console.log(chalk`\n {dim v${getMakeMagicVersion()}}\n\n`);
}

(async () => {
  // Ensures that ExperimentalWarning caused by fetch is suppressed
  suppressWarnings.fetch();

  useGracefulShutdown();

  const { version, help, projectName, template, branch, network, shareUsageData } = await parseFlags(globalOptions);
  const collectUsageData = await initializeUsageConfigIfneeded();
  const config = loadConfig();

  if (version) {
    console.log(getMakeMagicVersion());
    shutdown(0);
  }

  if (help) {
    sayHello();
    printHelp(globalOptions, template);
    shutdown(0);
  }

  if (shareUsageData !== undefined) {
    const consent = await modifyUsageConsent(shareUsageData);
    if (consent) {
      console.log('Thanks for helping us improve the developer experience by sharing anonymous usage data!');
    } else {
      console.log('You are now opted out of sharing anonymous usage data.');
    }
    shutdown(0);
  }

  sayHello();

  if (collectUsageData && config?.id) {
    SharedAnalytics.identifyUser(config.id);
  }

  // Run the scaffold...
  await createApp({ projectName, template, branch, network });
})().catch((err) => {
  SharedAnalytics.logEvent('cli-tool-error', { error: err });
  if (err instanceof CreateMagicAppError && err.code === CreateMagicAppErrorCode.USER_CANCELED_PROMPT) {
    // Skip logging errors about users canceling input, just exit!
    shutdown(1);
  }

  if (err instanceof CreateMagicAppError) {
    console.error(`\n${err.message}`);
    console.error(chalk`\nSee {bold --help} for information about proper options usage.`);
    shutdown(1);
  }

  console.error(err);
  shutdown(1);
});

function getMakeMagicVersion() {
  return JSON.parse(fs.readFileSync(resolveToRoot('package.json')).toString('utf8')).version;
}
