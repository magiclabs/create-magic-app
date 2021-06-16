import fs from 'fs';
import chalk from 'compiled/chalk';
import CFonts from 'compiled/cfonts';
import { ZombiError, ZombiErrorCode } from 'compiled/zombi';
import { createApp } from './create-app';
import { printHelp } from './help-text';
import { resolveToRoot } from './utils/path-helpers';
import { CreateMagicAppError } from './utils/errors-warnings';
import { parseFlags } from './flags';
import { globalOptions } from './global-options';

function sayHello() {
  CFonts.say('Create|Magic|App', {
    font: 'tiny',
    align: 'left',
    colors: ['system'],
    space: true,
    gradient: ['#6851ff', '#a796ff'],
    transitionGradient: true,
  });

  console.log(chalk` {dim v${getMakeMagicVersion()}}\n\n`);
}

(async () => {
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
