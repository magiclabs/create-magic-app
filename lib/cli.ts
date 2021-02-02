import meow from 'compiled/meow';
import CFonts from 'compiled/cfonts';
import { createApp } from './create-app';
import { helpText } from './help-text';

const cli = meow({
  flags: {
    projectName: { type: 'string', alias: 'p' },
    template: { type: 'string', alias: 't' },
    branch: { type: 'string', default: 'master', alias: 'b' },
    help: { type: 'boolean', default: false, alias: 'h' },
    version: { type: 'boolean', default: false, alias: 'v' },
  },

  help: helpText,
  autoHelp: false,
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
    cli.showVersion();
  }

  if (help) {
    sayHello();
    cli.showHelp();
  }

  sayHello();

  // Run the scaffold...
  await createApp(otherFlags as any);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
