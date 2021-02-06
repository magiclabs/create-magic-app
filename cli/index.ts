import meow from 'compiled/meow';
import CFonts from 'compiled/cfonts';
import fs from 'fs';
import { ZombiError, ZombiErrorCode } from 'zombi';
import { createApp } from './create-app';
import { printHelp } from './help-text';
import { resolveToRoot } from './utils/path-helpers';
import { CreateMagicAppError } from './utils/errors-warnings';

const cli = meow({
  flags: {
    projectName: { type: 'string', alias: 'p' },
    template: { type: 'string', alias: 't' },
    branch: { type: 'string', default: 'master', alias: 'b' },
    help: { type: 'boolean', default: false, alias: 'h' },
    version: { type: 'boolean', default: false, alias: 'v' },
  },

  autoHelp: false,
  autoVersion: false,
});

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
  const { version, help, ...otherFlags } = cli.flags;

  if (version) {
    const { version: pkgVersion } = JSON.parse(fs.readFileSync(resolveToRoot('package.json')).toString('utf8'));
    console.log(pkgVersion);
    process.exit(2);
  }

  if (help) {
    sayHello();
    printHelp(otherFlags.template);
    process.exit(2);
  }

  sayHello();

  // Run the scaffold...
  await createApp(otherFlags as any);
})().catch((err) => {
  if (err instanceof ZombiError && err.code === ZombiErrorCode.USER_CANCELED_PROMPT) {
    // Skip logging errors about users canceling input, just exit!
    process.exit(1);
  }

  if (err instanceof CreateMagicAppError) {
    console.error(`\n${err.message}`);
    process.exit(1);
  }

  console.error(err);
  process.exit(1);
});
