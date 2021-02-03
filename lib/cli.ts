import meow from 'compiled/meow';
import CFonts from 'compiled/cfonts';
import fs from 'fs';
import { createApp } from './create-app';
import { printHelp } from './help-text';
import { resolveToRoot } from './utils/path-helpers';

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
  console.error(err);
  process.exit(1);
});
