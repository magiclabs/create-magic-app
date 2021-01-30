#!/usr/bin/env node

import meow from 'meow';
import CFonts from 'cfonts';
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
  await createApp();
})();
