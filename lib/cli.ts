import meow from 'compiled/meow';
import CFonts from 'compiled/cfonts';
import { createApp } from './create-app';
import { helpText } from './help-text';

const cli = meow({
  flags: {
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
  if (cli.flags.version) cli.showVersion();

  if (cli.flags.help) {
    sayHello();
    cli.showHelp();
  }

  sayHello();

  // Run the scaffold...
  await createApp(cli.input[0]);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
