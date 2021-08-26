import fs from 'fs';
import chalk from 'chalk';
import { ZombiError, ZombiErrorCode } from 'zombi';
import { createApp } from './create-app';
import { printHelp } from './help-text';
import { resolveToRoot } from './utils/path-helpers';
import { CreateMagicAppError } from './utils/errors-warnings';
import { parseFlags } from './flags';
import { globalOptions } from './global-options';
import { useGracefulShutdown } from './utils/shutdown';

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
  useGracefulShutdown();

  const { version, help, projectName, template, branch } = await parseFlags(globalOptions);

  if (version) {
    console.log(getMakeMagicVersion());
    process.exit(0);
  }

  if (help) {
    sayHello();
    printHelp(globalOptions, template);
    process.exit(0);
  }

  sayHello();

  // Run the scaffold...
  await createApp({ projectName, template, branch });
})().catch((err) => {
  if (err instanceof ZombiError && err.code === ZombiErrorCode.USER_CANCELED_PROMPT) {
    // Skip logging errors about users canceling input, just exit!
    process.exit(1);
  }

  if (err instanceof CreateMagicAppError) {
    console.error(`\n${err.message}`);
    console.error(chalk`\nSee {bold --help} for information about proper options usage.`);
    process.exit(1);
  }

  console.error(err);
  process.exit(1);
});

function getMakeMagicVersion() {
  return JSON.parse(fs.readFileSync(resolveToRoot('package.json')).toString('utf8')).version;
}
