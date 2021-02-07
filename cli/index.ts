import chalk from 'compiled/chalk';
import CFonts from 'compiled/cfonts';
import fs from 'fs';
import { ZombiError, ZombiErrorCode } from 'zombi';
import { createApp, CreateMagicAppData } from './create-app';
import { printHelp } from './help-text';
import { resolveToRoot } from './utils/path-helpers';
import { CreateMagicAppError } from './utils/errors-warnings';
import { parseFlags, Flags } from './flags';
import { BINARY } from './config';

interface GlobalOptions extends CreateMagicAppData {
  help: boolean;
  version: boolean;
  [key: string]: any;
}

const globalOptions: Flags<GlobalOptions> = {
  projectName: {
    type: String,
    alias: 'p',
    description:
      'The name of your project. A top-level directory will be created from this value. If omitted, the project name will be prompted for interactively.',
  },

  template: {
    type: String,
    alias: 't',
    description: 'The base template to use. If omitted or invalid, the template will be prompted for interactively.',
  },

  branch: {
    type: String,
    alias: 'b',
    description: `The remote Git branch of \`${BINARY}\` from which to source templates. [default: "master"]`,
  },

  help: {
    type: Boolean,
    alias: 'h',
    description: `Show help (you're lookin' at it). ${chalk.bold(
      `If --template or -t is provided, template-specific documentation will be printed, too.`,
    )}`,
  },

  version: {
    type: Boolean,
    alias: 'v',
    description: `Show which version of \`${BINARY}\` is currently in use.`,
  },
};

function sayHello() {
  CFonts.say('Create|Magic|App', {
    font: 'tiny',
    align: 'left',
    colors: ['system'],
    space: true,
    gradient: ['#6851ff', '#a796ff'],
    transitionGradient: true,
  });
}

(async () => {
  const { version, help, projectName, template, branch = 'master' } = await parseFlags(globalOptions);

  if (version) {
    const { version: pkgVersion } = JSON.parse(fs.readFileSync(resolveToRoot('package.json')).toString('utf8'));
    console.log(pkgVersion);
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
    console.error(`\nSee ${chalk.bold('--help')} for information about proper options usage.`);
    process.exit(1);
  }

  console.error(err);
  process.exit(1);
});
